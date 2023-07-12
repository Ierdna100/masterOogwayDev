const { DiscordRequest, GetGatewayURL } = require('./discordRequest')
const { AddVariableToEnvFile } = require('./envManager')
const WebSocket = require('ws')
const { ReceivedGatewayEvent, SentGatewayEvent, Opcodes, CloseCodes } = require('./gatewayEvents')
const { ActivityTypes } = require('./activities')
const { Status } = require('./status')
const { Intents } = require('./intentsCalculator')
const express = require('express')
require('dotenv').config()

let discordSocketURL
let socketModeTemp

const socketModes = {
    RESUMED: "RESUMED",
    IDENTIFIED: "IDENTIFIED"
}

async function init() {
    await checkIfURLIdentExists()

    if ((process.env.RESUME_GATEWAY_URL && !(process.argv[2] == "force-ident")) || process.argv[2] == "force-resume")
    {
        discordSocketURL = process.env.RESUME_GATEWAY_URL
        socketModeTemp = socketModes.RESUMED
        console.log("Initializing websocket as a RESUMED socket")
    }
    else
    {
        discordSocketURL = `${process.env.SOCKET_URL}?v=10&encoding=json`
        socketModeTemp = socketModes.IDENTIFIED
        console.log("Initializing websocket as an IDENTIFIED socket")
    }
    
    main()
}

init()

let heartAck
let heartbeatID
let reconnects = 3
let readyEventData

let socketMode
let discordSocket
let expressServer
let internalExpressServer

function main()
{
    socketMode = socketModeTemp
    discordSocket = new WebSocket(discordSocketURL)
    expressServer = express()

    discordSocket.addEventListener("message", (event) => {
        msg = new ReceivedGatewayEvent(event)

        if (msg.opcode == Opcodes.HELLO) //Websocket open, discord sends Hello
        {
            heartbeatBeat() //my code sucks so I'll just call it once here
            heartbeatStart(msg.data.heartbeat_interval)
            if (socketMode == socketModes.IDENTIFIED) 
            {
                startIdent()
            }
            else
            {
                resume()
            }
            return
        }

        if (msg.opcode == Opcodes.ACK) //discord acknowledges heartbeat
        {
            heartAck = true
            return
        }

        if (msg.opcode == Opcodes.INVALID_SESSION) //resume event failed
        {
            if (msg.data == false) //cannot resume
            {
                discordSocket.close(CloseCodes.DISCONNECT)
                console.log("Could not resume")

                attemptReconnect(false)
            }
            else //Discord indicates resume is possible, attempt
            {
                discordSocket.close(CloseCodes.SESSION_TIMED_OUT)
                attemptReconnect(true)
            }

            return
        }

        if (msg.opcode == Opcodes.RECONNECT) //discord instructs to resume
        {
            attemptReconnect(true)
            return
        }

        if (msg.opcode == Opcodes.DISPATCH) { //Normal dispatch event
            process.env.LAST_SEQ = msg.eventID
            AddVariableToEnvFile("LAST_SEQ", process.env.LAST_SEQ)

            if (msg.eventName == 'READY') 
            {
                readyEventData = msg.data
                process.env.SESSION_ID = readyEventData.session_id
                AddVariableToEnvFile("SESSION_ID", process.env.SESSION_ID)
                AddVariableToEnvFile("RESUME_GATEWAY_URL", readyEventData.resume_gateway_url)
                console.log("Received ready event, websocket is established")
            }
            else 
            {
                //Handle Dispatch
            }
            return
        }
    })

    discordSocket.addEventListener("close", (closed) => {
        console.log(`OTHER PARTY CLOSED WITH CODE: ${closed.code} ${closed.reason}`)
        clearInterval(heartbeatID)

        if (closed.code == 1000 || closed.code == 1001) {
            attemptReconnect(false)
        }
        else if (closed.code <= 4009 || closed.code > 4014) { //{4010, 4011, 4012, 4013, 4014} are not codes that allow reconnection
            attemptReconnect(true)
        }
    })

    expressServer.get('/', (req, res) => {
        console.log(JSON.parse(req))
    })
    
    internalExpressServer = expressServer.listen(process.env.INTERNAL_SERVER_PORT, () => {
        console.log(`Internal server listening on ${process.env.INTERNAL_SERVER_PORT}`)
    })
}

function heartbeatStart(delay) {
    let jitter = (Math.random() * 0.5) + 0.5
    heartbeatID = setInterval(heartbeatBeat, delay * jitter)
}

function heartbeatBeat() {
    if (process.env.LAST_SEQ != null)
    {
        seqNum = parseInt(process.env.LAST_SEQ)
    }
    else 
    {
        seqNum = null
    }

    let heartbeat = new SentGatewayEvent(Opcodes.HEARTRBEAT, seqNum).toJson()
    discordSocket.send(heartbeat)

    setTimeout(acknowledgeHeartbeat, 5000) //confirm heartbeat within 5000 ms
}

function acknowledgeHeartbeat() {
    if (!heartAck) {
        clearInterval(heartbeatID)
        discordSocket.close(4009)
        attemptReconnect(true)
    }
    else
    {
        reconnects = 3
    }
    heartAck = false
}

/**
 * 
 * @param {Boolean} attemptResume If true, the code will attempt to resume instead of creating a new socket, by default false
 */
function attemptReconnect(attemptResume = false) {
    if (reconnects <= 0)
    {
        console.log("Tried to reconnect 3 times and failed. Stopping.")
        Quit()
        return
    }
    reconnects-- //we only try three times or something is very wrong

    if (attemptResume)
    {
        resume()
    }
    else
    {
        checkIfURLIdentExists()

        discordSocketURL = `${process.env.SOCKET_URL}?v=10&encoding=json`
        socketMode = socketModes.IDENTIFIED
        console.log("Initializing websocket as an IDENTIFIED socket")

        discordSocket = new WebSocket(discordSocketURL)
    }
}

function resume() {
    socketMode = socketModes.RESUMED
    resumeEvent = new SentGatewayEvent(Opcodes.RESUME, { token: process.env.DISCORD_TOKEN, session_id: process.env.SESSION_ID, seq: process.env.LAST_SEQ }).toJson()
    discordSocket.send(resumeEvent)
}

function startIdent() {
    AddVariableToEnvFile("IDENT_CALLS", parseInt(process.env.IDENT_CALLS) + 1)

    data = {
        token: process.env.DISCORD_TOKEN,
//        intents: 55840, //0 1101 1010 0010 0000, WEBHOOKS, MESSAGES, TYPING, DM, DM_TYPING, MESSAGE_CONTENT (activate the sensitive thing)
        intents: new Intents(false, false, false, false, false, true, false, false, false, true, false, true, true, false, true, false, false).toInt(),
        properties: {
            os: process.platform,
            browser: "noneofthem",
            device: "3700xcpu"
        },
        presence: {
            since: null,
            activities: {
                name: "test name",
                type: ActivityTypes.GAME
            },
            status: Status.ONLINE,
            afk: false
        }
    }

    let identEvent = new SentGatewayEvent(Opcodes.IDENT, data).toJson()
    discordSocket.send(identEvent)
}

async function checkIfURLIdentExists()
{
    if (!process.env.SOCKET_URL) 
    {
        let newURL = await GetGatewayURL()
        process.env.SOCKET_URL = newURL //temporary, for this session only
        AddVariableToEnvFile("SOCKET_URL", newURL) // applies next session after dotenv is reconfigured
    }
}

function Quit() 
{
    internalExpressServer.close()

    if (discordSocket)
    {
        discordSocket.close(1000)
    }
}
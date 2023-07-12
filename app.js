const { DiscordRequest, GetGatewayURL } = require('./discordRequest')
const { AddVariableToEnvFile } = require('./envManager')
const WebSocket = require('ws')
const { GatewayEvent, Opcodes, CloseCodes, CloseCodesReconnectPossibility } = require('./gatewayEvents')
const { ActivityTypes } = require('./activities')
const { Status } = require('./status')
const { Intents } = require('./intentsCalculator')
//const { Logger } = require('./loggingManager')'
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

    if (process.env.RESUME_GATEWAY_URL && !(process.argv[2] == "force-ident"))
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

//this works very shittily
//let logger = new Logger()

/*left to do:
    - Implement resuming code
    - Implement DB code
    - Implement shit with mc
    - Implement commands
    - Implements external script to handle everything
    - Implement Steam RCON code (or maybe the other mc fancy one?)

    - RESUME DOESN'T WORK?
*/

let heartAck
let heartbeatID
let reconnects = 3
let readyEventData

let socketMode
let discordSocket
let internalServer

function main()
{
    socketMode = socketModeTemp
    discordSocket = new WebSocket(discordSocketURL)
    internalServer = express()

    discordSocket.addEventListener("message", (event) => {
        msg = JSON.parse(event.data)
        msg = new GatewayEvent(msg.op, msg.d, msg.s, msg.t)
        console.log(msg)

        if (msg.op == Opcodes.HELLO) 
        {
            heartbeatBeat()
            heartbeatStart(msg.d.heartbeat_interval)
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

        if (msg.op == Opcodes.ACK) 
        {
            heartAck = true
            return
        }

        if (msg.op == Opcodes.INVALID_SESSION) //resume event failed
        {
            discordSocket.close(CloseCodes.SESSION_TIMED_OUT)

            checkIfURLIdentExists()
            socketMode = socketModes.IDENTIFIED
            console.log("OOOPSIE?")

            if (msg.d == false) 
            {

            }
            else
            {
                resume()
            }
            //discordSocket = new WebSocket(`${process.env.SOCKET_URL}?v=10&encoding=json`)

            return
        }

        // if (msg.op == Opcodes.RESUMED)
        // {
        //     console.log("websocket resumed")
        // }

        if (msg.op == Opcodes.RECONNECT) //uh oh?
        {

            return
        }

        if (msg.op == Opcodes.DISPATCH) {
            process.env.LAST_SEQ = msg.s
            AddVariableToEnvFile("LAST_SEQ", process.env.LAST_SEQ)

            if (msg.t == 'READY') 
            {
                readyEventData = msg.d
                process.env.SESSION_ID = readyEventData.session_id
                AddVariableToEnvFile("SESSION_ID", process.env.SESSION_ID)
                AddVariableToEnvFile("RESUME_GATEWAY_URL", readyEventData.resume_gateway_url)
                console.log("Received ready event, websocket is established")
            }
            else 
            {

            }
            return
        }
    })

    discordSocket.addEventListener("close", (closed) => {
        console.log(JSON.parse(closed))
        console.log(`OTHER PARTY CLOSED WITH CODE: ${closed.code} - ${closed.reason}`)
        clearInterval(heartbeatID)
    })

    internalServer.get('/', (req, res) => {
        console.log(JSON.parse(req))
    })
    
    internalServer.listen(process.env.INTERNAL_SERVER_PORT, () => {
        console.log(`Internal server listening on ${process.env.INTERNAL_SERVER_PORT}`)
    })
}

function heartbeatStart(delay) {
    let jitter = (Math.random() * 0.5) + 0.5
    //console.log(`jitter:${jitter}, timer: ${delay}; ${delay * jitter}`)
    heartbeatID = setInterval(heartbeatBeat, delay * jitter)
}

function heartbeatBeat() {
    //console.log("heart has beaten")
    if (process.env.LAST_SEQ != null)
    {
        seqNum = parseInt(process.env.LAST_SEQ)
    }
    else 
    {
        seqNum = null
    }

    let heartbeat = new GatewayEvent(Opcodes.HEARTRBEAT, seqNum).toJson()
    console.log(heartbeat)
    discordSocket.send(heartbeat)

    setTimeout(acknowledgeHeartbeat, 5000) //confirm heartbeat within 5000 ms
}

function acknowledgeHeartbeat() {
    if (!heartAck) {
        clearInterval(heartbeatID)
        discordSocket.close(4009)
        attemptReconnect()
    }
    else
    {
        reconnects = 3
    }
    heartAck = false
}

function attemptReconnect() {
    if (reconnects <= 0)
    {
        console.log("Tried to reconnect 3 times and failed. Stopping.")
        return
    }
    reconnects-- //we only try three times or something is very wrong

    resume()
}

function resume() {
    resumeEvent = new GatewayEvent(Opcodes.RESUME, { token: process.env.DISCORD_TOKEN, session_id: process.env.SESSION_ID, seq: process.env.LAST_SEQ }).toJson()
    console.log(resumeEvent)
    discordSocket.send(resumeEvent)
}

function startIdent() {
    AddVariableToEnvFile("IDENT_CALLS", parseInt(process.env.IDENT_CALLS) + 1)

    data = {
        token: process.env.DISCORD_TOKEN,
//        intents: 55840, //0 1101 1010 0010 0000, WEBHOOKS, MESSAGES, TYPING, DM, DM_TYPING, MESSAGE_CONTENT (activate the sensitive thing)
        intents: new Intents(false, false, false, false, false, true, false, false, false, true, false, true, true, false, true, false, false).toInt(),
        properties: {
            os: "windows10",
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

    let identEvent = new GatewayEvent(Opcodes.IDENT, data).toJson()
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
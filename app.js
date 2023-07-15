const { DiscordRequest, GetGatewayURL } = require('./http/discordRequest')
const { AddVariableToEnvFile, checkIfURLIdentExists } = require('./env/envManager')
const WebSocket = require('ws')
const { ReceivedGatewayEvent, SentGatewayEvent, Opcodes, CloseCodes } = require('./gateway/gatewayEvents')
const { ActivityTypes } = require('./enums/activities')
const { Status } = require('./enums/status')
const { Intents } = require('./gateway/intentsCalculator')
const { HandleDispatchEvent } = require('./gateway/commandsHandler')
const express = require('express')
const fs = require('fs')
const { HTTPMethods } = require('./http/httpMethods')
const exp = require('constants')
require('dotenv').config()

let discordSocketURL
let socketModeTemp

const socketModes = {
    RESUMED: "RESUMED",
    IDENTIFIED: "IDENTIFIED"
}

async function init() {
    await checkIfURLIdentExists()

    /**@type {boolean} */
    let forceIdent = false
    /**@type {boolean} */
    let forceResume = false
    /**@type {boolean} */
    let fetchCommands = false
    /**@type {boolean} */
    let resumeURLExists = !(process.env.RESUME_GATEWAY_URL == "")

    process.argv.forEach((element, index) => {
        if (element == "force-ident") 
        {
            forceResume = false
            forceIdent = true
        } 
        else if (element == "force-resume")
        {
            forceResume = true
            forceIdent = false
        }
        else if (element == "fetch-commands")
        {
            fetchCommands = true
        }
    })

    if ((resumeURLExists && !forceIdent) || forceResume)
    {
        discordSocketURL = process.env.RESUME_GATEWAY_URL
        socketModeTemp = socketModes.RESUMED
        console.log("Initializing websocket as a RESUMED socket")
    }
    else
    {
        discordSocketURL = `${process.env.SOCKET_URL}`
        socketModeTemp = socketModes.IDENTIFIED
        console.log("Initializing websocket as an IDENTIFIED socket")
    }

    if (fetchCommands)
    {
        let writeData = await DiscordRequest(`/applications/${process.env.APP_ID}/commands`, { method: HTTPMethods.GET})
        fs.writeFileSync('./logs/appCommands.json', JSON.stringify(writeData, null, '\t'))
    }
    
    main()
}

init()

let heartAck
let heartbeatID
let heartbeatAckID
let reconnects = 3
let readyEventData
let discordGatewayReady = false

let socketMode
/**@type {WebSocket} */
let discordSocket
/**@type {Express} */
let expressServerSetup
/**@type {Express} */
let activeExpressServer

function main()
{
    socketMode = socketModeTemp
    expressServerSetup = express()
    expressServerSetup.use(express.json())

    createWebSocket()

    expressServerSetup.get('/isReady/', (req, res) => {
        if (discordGatewayReady)
        {
            res.send("OK")
        }
        else 
        {
            res.send("FAIL")
        }
    })
    
    activeExpressServer = expressServerSetup.listen(process.env.INTERNAL_SERVER_PORT, () => {
        console.log(`Internal server listening on ${process.env.INTERNAL_SERVER_PORT}`)
    })
}

function createWebSocket()
{
    discordSocket = new WebSocket(discordSocketURL)

    discordSocket.addEventListener("message", (event) => {
        /**@type {ReceivedGatewayEvent} */
        let msg
        msg = new ReceivedGatewayEvent(event)

        //Websocket open, discord sends Hello
        if (msg.opcode == Opcodes.HELLO)
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

         //discord acknowledges heartbeat
        if (msg.opcode == Opcodes.ACK)
        {
            heartAck = true
            return
        }

        //resume event failed
        if (msg.opcode == Opcodes.INVALID_SESSION) 
        {
            discordSocketNoLongerRead()

            if (msg.data == false) //cannot resume
            {
                discordSocket.close(CloseCodes.DISCONNECT)
                console.log("Could not resume")
            }
            else //Discord indicates resume is possible, attempt
            {
                discordSocket.close(CloseCodes.SESSION_TIMED_OUT)
            }

            return
        }

        //discord instructs to resume
        if (msg.opcode == Opcodes.RECONNECT) 
        {
            discordSocketNoLongerRead()

            discordSocket.close(CloseCodes.SESSION_TIMED_OUT)
            return
        }

        //Normal dispatch event
        if (msg.opcode == Opcodes.DISPATCH) {
            process.env.LAST_SEQ = msg.eventID
            AddVariableToEnvFile("LAST_SEQ", process.env.LAST_SEQ)

            if (msg.eventName == 'READY') 
            {
                readyEventData = msg.data
                process.env.SESSION_ID = readyEventData.session_id
                AddVariableToEnvFile("SESSION_ID", process.env.SESSION_ID)
                AddVariableToEnvFile("RESUME_GATEWAY_URL", readyEventData.resume_gateway_url)
                console.log("Received ready event, websocket is established")

                discordGatewayReady = true
            }
            else 
            {
                HandleDispatchEvent(msg)
            }
            return
        }
    })

    //Listen for close events
    discordSocket.addEventListener("close", (closed) => {
        //console.log(closed)
        console.log(`CLOSED SOCKET WITH CODE: ${closed.code} ${closed.reason}`)
        clearInterval(heartbeatID)
        clearTimeout(heartbeatAckID)

        if (closed.code == 1000 || closed.code == 1001) {
            attemptReconnect(false)
        }
        else if (closed.code <= 4009 || closed.code > 4014) { //{4010, 4011, 4012, 4013, 4014} are not codes that allow reconnection (+ 1 I forgor)
            attemptReconnect(true)
        }
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

    heartbeatAckID = setTimeout(acknowledgeHeartbeat, 5000) //confirm heartbeat within 5000 ms
}

function acknowledgeHeartbeat() 
{
    //console.log(`HEARTBEAT ACK?: ${heartAck}`)

    if (!heartAck) {
        clearInterval(heartbeatID)
        clearTimeout(heartbeatAckID)
        discordSocket.close(4009)
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
        checkIfURLIdentExists()

        discordSocketURL = `${process.env.RESUME_GATEWAY_URL}`
        socketMode = socketModes.RESUMED
        console.log("Initialiazing websocket as a RESUMED socket")

        createWebSocket()
    }
    else
    {
        checkIfURLIdentExists()

        discordSocketURL = `${process.env.SOCKET_URL}`
        socketMode = socketModes.IDENTIFIED
        console.log("Initializing websocket as an IDENTIFIED socket")

        createWebSocket()
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
        intents: new Intents().guild_messages().direct_messages().p_message_content().parse(), //37376 (MESSAGE_CONTENT is required for some things)
        properties: {
            os: process.platform,
            browser: process.env.BROWSER_NAME,
            device: process.env.DEVICE_NAME
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

function discordSocketNoLongerRead(){
    discordGatewayReady = false
}

function Quit() 
{
    activeExpressServer.close()
    discordSocket.close(1000)
    process.exit()
}
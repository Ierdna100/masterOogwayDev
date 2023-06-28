const { DiscordRequest, GetGatewayURL } = require('./discordRequest')
const { AddVariableToEnvFile } = require('./envManager')
const WebSocket = require('ws')
const { GatewayEvent, Opcodes, TimedEvent } = require('./gatewayEvents')
const { ActivityTypes } = require('./activities')
const { Status } = require('./status')
const { Intents } = require('./intentsCalculator')
require('dotenv').config()

async function init() {
    if (!process.env.SOCKET_URL) {
        let newURL = await GetGatewayURL()
        process.env.SOCKET_URL = newURL //temporary, for this session only
        AddVariableToEnvFile("SOCKET_URL", newURL) // applies next session after dotenv is reconfigured
    }
}

init()

let heartAck
let ready = false
let heartbeatID

let fullURL = `${process.env.SOCKET_URL}?v=10&encoding=json`

const discordSocket = new WebSocket(fullURL)

discordSocket.addEventListener("message", (event) => {
    msg = JSON.parse(event.data)
    msg = new GatewayEvent(msg.op, msg.d, msg.s, msg.t)
    console.log(msg)

    if (msg.op == Opcodes.HELLO) {
        heartbeatBeat()
        heartbeatStart(msg.d.heartbeat_interval)
    }

    if (msg.op == Opcodes.ACK) {
        heartAck = true
    }

    if (msg.op == Opcodes.DISPATCH) {

    }
})

discordSocket.addEventListener("ready", (event) => {
    msg = JSON.parse(event.data)
    msg = new GatewayEvent(msg.op, msg.d, msg.s, msg.t)
    console.log(msg)
})

discordSocket.addEventListener("error", (err) => {
    console.log(err)
})

discordSocket.addEventListener("close", (closed) => {
    console.log("OTHER PARTY CLOSED")
    clearInterval(heartbeatID)
})

function heartbeatStart(delay) {
    let jitter = (Math.random() * 0.5) + 0.5
    console.log(`jitter:${jitter}, times: ${delay}; ${delay * jitter}`)
    heartbeatID = setInterval(heartbeatBeat, delay * jitter)

    startIdent()
}

function heartbeatBeat() {
    console.log("heart has beaten")
    heartbeat = new GatewayEvent(Opcodes.HEARBEAT).toJson()
    discordSocket.send(heartbeat)

    setTimeout(acknowledgeHeartbeat, 5000) //confirm heartbeat within 5000 ms
}

function acknowledgeHeartbeat() {
    if (heartAck) {
        console.log("WERE FINE")
    }
    else
    {
        console.log("WERE NOT FINE")
    }
    heartAck = false
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
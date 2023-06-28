const { DiscordRequest, GetGatewayURL } = require('./discordRequest')
const { AddVariableToEnvFile } = require('./envManager')
const WebSocket = require('ws')
require('dotenv').config()

async function init() {
    if (!process.env.SOCKET_URL) {
        let newURL = await GetGatewayURL()
        process.env.SOCKET_URL = newURL //temporary, for this session only
        AddVariableToEnvFile("SOCKET_URL", newURL) // applies next session after dotenv is reconfigured
    }
}

init()

let fullURL = `${process.env.SOCKET_URL}?v=10&encoding=json`

const discordSocket = new WebSocket(fullURL)

discordSocket.addEventListener("open", (event) => {
    console.log(event)
})


const fetch = require('node-fetch')
require('dotenv').config()

DISCORD_URL = process.env.DISCORD_URL

async function DiscordRequest(endpoint, options)
{
    request = {
        method: options.method,
        headers: {
            "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'
        }
    }

    if (options.body) {
        request.body = JSON.stringify(options.body)
    }
    console.log(`${DISCORD_URL}${endpoint}`)

    await fetch(`${DISCORD_URL}${endpoint}`, request)
    .then(async res => {
        console.log(`${res.status} - ${res.statusText}`)
        resAsJson = res.json()
    })
    .catch(err => {
        console.log(err)
    })

    return resAsJson
}

async function GetGatewayURL() {
    let res = await DiscordRequest(`/gateway`, { method: "GET" })
    return res.url
}

module.exports = { DiscordRequest, GetGatewayURL }
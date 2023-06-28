const fetch = require('node-fetch')
require('dotenv').config()

const DISCORD_URL = "https://discord.com/api/v10/applications/"

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

    fetch(`${DISCORD_URL}${endpoint}`, request)
    .then(async res => {
        console.log(`${res.status} - ${res.statusText}`)
        let res2 = await res.text()
        return JSON.parse(res2)
    })
    .catch(err => {
        console.log(err)
        return
    })
}

module.exports = { DiscordRequest }
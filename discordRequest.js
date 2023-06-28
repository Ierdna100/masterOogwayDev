const fetch = require('node-fetch')
require('dotenv').config()

const DISCORD_URL = "https://discord.com/api/v10/applications/"

async function DiscordRequest(endpoint, method, data)
{
    fetch(`${DISCORD_URL}${endpoint}`, {
        method: method,
        headers: {
            "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
            'Accept': 'application/json; charset=UTF-8'
        },
        body: data == undefined ? null : JSON.stringify(data) //we don't want a body for certain operations. I think.
    })
    .then(async res => {
        //console.log(`${res.status} - ${res.statusText}`)
        let res2 = await res.text()
        return JSON.parse(res2)
    })
    .catch(err => {
        console.log(err)
        return
    })
}

const HTTPMethods = {
    GET: "GET",
    DELETE: "DELETE",
    POST: "POST",
    HEAD: "HEAD",
    PUT: "PUT",
    CONNECT: "CONNECT",
    OPTIONS: "OPTIONS",
    TRACE: "TRACE",
    PATCH: "PATCH"
}

module.exports = { DiscordRequest, HTTPMethods }
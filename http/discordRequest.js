const fetch = require('node-fetch')
require('dotenv').config()
const { HTTPMethods } = require('./httpMethods.js')
const { InteractionResponse } = require('./response')
const { ReceivedGatewayEvent } = require('../gateway/gatewayEvents')

DISCORD_URL = process.env.DISCORD_URL


/**
 * @param {string} endpoint Endpoint
 * @param { {method: HTTPMethods, body: string} } options Data to send
 * @returns HTTP response
 * 
 * @example
 * 
 * ```js
 * let options = {
 *      method: HTTPMethods.POST,
 *      body: {"cmd": "/ping"}
 * }
 * 
 * let res = await DiscordRequest('/endpoint', options)
 * ```
 */
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
    //console.log(`${DISCORD_URL}${endpoint}`)
    //console.log(request)

    fullURL = `${DISCORD_URL}${endpoint}`
    //fullURL = `http://10.0.0.70:3000/`

    await fetch(fullURL, request)
    .then(async res => {
        //console.log(`${res.status} - ${res.statusText}`)
        if (options.method == HTTPMethods.GET)
        {
            returnValue = res.json()
        }
        else
        {
            returnValue = res
        }
    })
    .catch(err => {
        console.log(err)
    })

    return returnValue
}

async function GetGatewayURL() {
    let res = await DiscordRequest(`/gateway`, { method: HTTPMethods.GET })
    console.log(res)
    return res.url
}

/**
 * 
 * @param {ReceivedGatewayEvent.data} interaction Original GatewayEvent
 * @param {InteractionResponse} response Response object
 * @returns 
 */
async function InteractionRequest(interaction, response) {
    const interactionEndpoint = `/interactions/${interaction.id}/${interaction.token}/callback`
    //const successCode = 204

    return await DiscordRequest(interactionEndpoint, { method: HTTPMethods.POST, body: response })
}

module.exports = { DiscordRequest, GetGatewayURL, InteractionRequest }
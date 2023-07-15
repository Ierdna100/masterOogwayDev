const { ReceivedGatewayEvent } = require("./gatewayEvents");
const { InteractionRequest } = require('../http/discordRequest.js');
const { InteractionResponse, InteractionResponseType } = require("../http/response");

/**
 * 
 * @param {ReceivedGatewayEvent} event 
 */
async function HandleDispatchEvent(event) {
    switch(event.eventName) {
        case "INTERACTION_CREATE":
            HandleCommand(event.data)
            break
        default:
            console.log(`Dispatch event <${event.eventName}> is not handleable`)
    }
}

async function HandleCommand(eventData) {
    console.log(JSON.stringify(eventData.data, null, "\t"))
    switch(eventData.data.name) {
        case "ping":
        case "jfr": //further options exist
        case "server-info":
        case "list":
        case "jfr-stop":
        case "allow-idling":
        case "server-time":
        case "ping-daytime":
        case "stop": 
        case "screenshot": 
        case "debug":
        case "cmd": //further options exist
        case "whitelist": //further options exist
        case "logs": //further options exist
        case "restart"://further options exist
        case "whisper": //further options exist
        default:
            handlerRes = await InteractionRequest(eventData, new InteractionResponse(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, { content: "501 - Not Implemented" }))
            console.log(`Dispatched INTERACTION_CREATE event <${eventData.data.name}> is not handleable`)
    }

    console.log(`Handler response code: ${handlerRes.status} - ${handlerRes.statusText}`)
}

module.exports = { HandleDispatchEvent }
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
    
    switch(eventData.data.name) {
        case "ping":
            handlerRes = await InteractionRequest(eventData, new InteractionResponse(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, { content: "Pong?" }))
            break
        default:
            console.log(`Dispatched INTERACTION_CREATE event <${eventData.data.name}> is not handleable`)
            return
    }

    console.log(`Handler response code: ${handlerRes.status} - ${handlerRes.statusText}`)
}

module.exports = { HandleDispatchEvent }
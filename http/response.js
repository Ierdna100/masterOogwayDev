/**
 * @class Reponse object for replies to the Discord API
 */
class InteractionResponse {
    /**
     * @constructor
     * Creates an instance of a Response
     * @param {InteractionResponseType} type Type of response
     * @param {{tts: boolean, content: string, embeds: Array<Embeds>, allowed_mentions: AllowedMentions, flags: number, components: Array<components>, attachements: Array<partialAttachement>}} data Data to respond with (all params are optional)
     */
    constructor(type, data = {}) {
        this.type = type
        this.data = data
    }
}

/**@enum {number} Interaction response types */
const InteractionResponseType = {
    /**@param PONG ACK a `Ping`*/ PONG: 1,
    /**@param CHANNEL_MESSAGE_WITH_SOURCE respond to an interaction with a message*/ CHANNEL_MESSAGE_WITH_SOURCE: 4,
    /**@param DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE ACK an interaction and edit a response later, the user sees a loading state*/ DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
    /**@param DEFERRED_UPDATE_MESSAGE for components, ACK an interaction and edit the original message later, the user does not see a loading state*/ DEFERRED_UPDATE_MESSAGE: 6,
    /**@param UPDATE_MESSAGE for components, edit the message the component was attached to*/ UPDATE_MESSAGE: 7,
    /**@param APPLICATION_COMMAND_AUTOCOMPLETE_RESULT respond to an autocomplete interaction with suggested choices*/ APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
    /**@param MODAL respond to an interaction with a popup modal*/ MODAL: 9
}

module.exports = { InteractionResponse, InteractionResponseType }
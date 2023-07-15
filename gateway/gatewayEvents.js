/** 
 * @class class representing a GatewayEvent that was received 
 * @param opcode (op) Opcode of the GatewayEvent
 * @param data (d) Data of the GatewayEvent
 * @param eventID (s) EventID of the GatewayEvent
 * @param eventName (t) EventID of the GatewayEvent
*/
class ReceivedGatewayEvent {
    /**
     * 
     * @param {WebSocket.MessageEvent} data MessageEvent to be parsed
     */
    constructor(data) {
        let msg = JSON.parse(data.data)
        this.opcode = msg.op
        this.data = msg.d
        this.eventID = msg.s
        this.eventName = msg.t
        
        console.log(this)
    }

    /**
     * 
     * @returns JSON of the object
     */
    toJson() {
        return JSON.stringify(this)
    }
}

/** 
 * @class class representing a GatewayEvent that will be sent 
 * @param opcode (op) Opcode of the GatewayEvent
 * @param data (d) Data of the GatewayEvent
 * @param eventID (s) EventID of the GatewayEvent
 * @param eventName (t) EventID of the GatewayEvent
 * */
class SentGatewayEvent {
    /**
     * 
     * @param {Opcodes} opcode (op) Opcode of the GatewayEvent
     * @param {JSON} data (d) Data of the GatewayEvent
     * @param {Integer} eventID (s) EventID of the GatewayEvent
     * @param {String} eventName (t) Event name of the GatewayEvent
     */
    constructor(opcode, data = undefined, eventID = null, eventName = null) {
        this.op = opcode

        if (data != undefined) {
            this.d = data
        } else {
            this.d = {}
        }

        if (this.op != 0) {
            this.s = null
            this.t = null
        } else {
            this.s = eventID
            this.t = eventName
        }

        console.log(this)
    }

    /**
     * 
     * @returns JSON of the object
     */
    toJson() {
        return JSON.stringify(this)
    }
}

/**
 * @enum {number} Payload opcodes
 */
const Opcodes = {
    /** @param DISPATCH Rx 0 - An event was dispatched.*/ DISPATCH: 0,
    /** @param HEARTRBEAT Rx/Tx 1 - Fired periodically by the client to keep the connection alive.*/ HEARTRBEAT: 1,
    /** @param IDENT Tx 2 - Starts a new session during the initial handshake.*/ IDENT: 2,
    /** @param PRESENC_UPDATE Tx 3 - Update the client's presence.*/ PRESENCE_UPDATE: 3,
    /** @param VOICE_STATE_UPDATE Tx 4 - Used to join/leave or move between voice channels.*/ VOICE_STATE_UPDATE: 4,
    /** @param RESUME Tx 6 - Resume a previous session that was disconnected.*/ RESUME: 6,
    /** @param RECONNECT Rx 7 - You should attempt to reconnect and resume immediately.*/ RECONNECT: 7,
    /** @param REQUEST_GUILD_MEMBERS Tx 8 - Request information about offline guild members in a large guild.*/ REQUEST_GUILD_MEMBERS: 8,
    /** @param INVALID_SESSION Rx 9 - The session has been invalidated. You should reconnect and identify/resume accordingly.*/ INVALID_SESSION: 9,
    /** @param HELLO Rx 10 - Sent immediately after connecting, contains the `heartbeat_interval` to use.*/ HELLO: 10,
    /** @param ACK Rx 11 - Sent in response to receiving a heartbeat to acknowledge that it has been received.*/ ACK: 11
}

/**
 * @enum {number} Close codes of the websocket
 */
const CloseCodes = {
    /**@param DISCONNECT 1000 - Successfully disconnected.*/ DISCONNECT: 1000,
    /**@param UNKNOWN_ERROR 4000 - We're not sure what went wrong. Try reconnecting?*/ UNKNOWN_ERROR: 4000,
    /**@param UNKNOWN_OPCODE 4001 - You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!*/ UNKNOWN_OPCODE: 4001,
    /**@param DECODE_ERROR 4002 - You sent an invalid payload to Discord. Don't do that!*/ DECODE_ERROR: 4002,
    /**@param NOT_AUTHENTICATED 4003 - You sent us a payload prior to identifying.*/ NOT_AUTHENTICATED: 4003,
    /**@param AUTHENTICATION_FAILED 4004 - The account token sent with your identify payload is incorrect.*/ AUTHENTICATION_FAILED: 4004,
    /**@param ALREADY_AUTHENTICATED 4005 - You sent more than one identify payload. Don't do that!*/ ALREADY_AUTHENTICATED: 4005,
    /**@param INVALID_SEQUENCE 4007 - The sequence sent when resuming the session was invalid. Reconnect and start a new session.*/ INVALID_SEQUENCE: 4007,
    /**@param RATE_LIMITED 4008 - Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this.*/ RATE_LIMITED: 4008,
    /**@param SESSION_TIMED_OUT 4009 - Your session timed out. Reconnect and start a new one.*/ SESSION_TIMED_OUT: 4009,
    /**@param INVALID_SHARD 4010 - You sent us an invalid shard when identifying.*/ INVALID_SHARD: 4010,
    /**@param SHARDING_REQUIRED 4011 - The session would have handled too many guilds - you are required to shard your connection in order to connect.*/ SHARDING_REQUIRED: 4011,
    /**@param INVALID_API_VERSION 4012 - You sent an invalid version for the gateway.*/ INVALID_API_VERSION: 4012, 
    /**@param INVALID_INTENTS 4013 - You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.*/ INVALID_INTENTS: 4013,
    /**@param DISALOWED_INTENTS 4014 - You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not approved for.*/ DISALOWED_INTENTS: 4014
}

module.exports = { ReceivedGatewayEvent, SentGatewayEvent, Opcodes, CloseCodes }
/** 
 * @class class representing a GatewayEvent that was received 
 * @param opcode (op) Opcode of the GatewayEvent
 * @param data (d) Data of the GatewayEvent
 * @param eventID (s) EventID of the GatewayEvent
 * @param eventName (t) EventID of the GatewayEvent
*/
class ReceivedGatewayEvent {
    opcode
    data
    eventID
    eventName

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
    opcode
    data
    eventID
    eventName
    
    /**
     * 
     * @param {Opcodes} opcode 
     * @param {JSON} data 
     * @param {Integer} eventID 
     * @param {String} eventName 
     */
    constructor(opcode, data = undefined, eventID = null, eventName = null) {
        this.opcode = opcode

        if (data != undefined) {
            this.data = data
        } else {
            this.data = {}
        }

        if (opcode != 0) {
            this.eventID = null
            this.eventName = null
        } else {
            this.eventID = eventID
            this.eventName = eventName
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


const Opcodes = {
    DISPATCH: 0,
    HEARTRBEAT: 1,
    IDENT: 2,
    PRESENCE_UPDATE: 3,
    VOICE_STATE_UPDATE: 4,
    RESUME: 6,
    RECONNECT: 7,
    REQUEST_GUILD_MEMBERS: 8,
    INVALID_SESSION: 9,
    HELLO: 10,
    ACK: 11
}

const CloseCodes = {
    UNKNOWN_ERROR: 4000,
    UNKNOWN_OPCODE: 4001,
    DECODE_ERROR: 4002,
    NOT_AUTHENTICATED: 4003,
    AUTHENTICATION_FAILED: 4004,
    ALREADY_AUTHENTICATED: 4005,
    INVALID_SEQUENCEL: 4007,
    RATE_LIMITED: 4008,
    SESSION_TIMED_OUT: 4009,
    INVALID_SHARD: 4010,
    SHARDING_REQUIRED: 4011,
    INVALID_API_VERSION: 4012, 
    INVALID_INTENTS: 4013,
    DISALOWED_INTENTS: 4014
}

const CloseCodesReconnectPossibility = {
    UNKNOWN_ERROR: true,
    UNKNOWN_OPCODE: true,
    DECODE_ERROR: true,
    NOT_AUTHENTICATED: true,
    AUTHENTICATION_FAILED: false,
    ALREADY_AUTHENTICATED: true,
    INVALID_SEQUENCEL: true,
    RATE_LIMITED: true,
    SESSION_TIMED_OUT: true,
    INVALID_SHARD: false,
    SHARDING_REQUIRED: false,
    INVALID_API_VERSION: false, 
    INVALID_INTENTS: false,
    DISALOWED_INTENTS: false
}

module.exports = { ReceivedGatewayEvent, SentGatewayEvent, Opcodes, CloseCodes, CloseCodesReconnectPossibility }
class GatewayEvent {
    constructor(opcode, data = undefined, eventID = null, eventName = null) {
        this.op = opcode

        if (data != undefined) {
            this.d = data
        } else {
            this.d = {}
        }

        if (opcode != 0) {
            this.s = null
            this.t = null
        } else {
            this.s = eventID
            this.t = eventName
        }
    }

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

module.exports = { GatewayEvent, Opcodes, CloseCodes, CloseCodesReconnectPossibility }
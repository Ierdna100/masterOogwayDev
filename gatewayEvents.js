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
    HEARBEAT: 1,
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

module.exports = { GatewayEvent, Opcodes, TimedEvent }
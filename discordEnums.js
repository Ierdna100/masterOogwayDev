const ApplicationCommandType = {
    CHAT_INPUT: 1,
    USER: 2,
    MESSAGE: 3
}

const ApplicationSubCommandType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
    ATTACHEMENT: 11
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

module.exports = {ApplicationCommandType, ApplicationSubCommandTypem, Opcodes}
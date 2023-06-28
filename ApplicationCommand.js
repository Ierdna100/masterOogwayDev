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

module.exports = {ApplicationCommandType, ApplicationSubCommandType }
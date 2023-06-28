class Intents {
    constructor(GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_EMOJIS_AND_STICKERS, GUILD_INTEGRATIONS, GUILD_WEBHOOKS, GUILD_INVITES, GUILD_VOICE_STATES,
        GUILD_PRESENCES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, GUILD_MESSAGE_TYPING, DIRECT_MESSAGES, DIRECT_MESSAGE_REACTIONS, DIRECT_MESSAGE_TYPING,
        MESSAGE_CONTENT, GUILD_SCHEDULED_EVENTS) 
    {

            const warningMask = GUILD_MEMBERS << 3 | GUILD_PRESENCES << 8 | MESSAGE_CONTENT << 15

            this.intents = parseInt(0)

            for (let index = 0; index <= 16; index++) {
                this.intents = this.intents | arguments[index] << [index]
            }

            if (this.intents & warningMask != 0) {
                console.warn("Warning! You are trying to used intents which require additional permissions.")
            }
    }

    toInt() {
        return this.intents
    }
}

module.exports = { Intents }
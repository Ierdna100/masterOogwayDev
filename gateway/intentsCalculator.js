/**@class Creates an intents object to easily set them */
/**@see https://ziad87.net/intents/*/
class Intents {
    /**@see https://ziad87.net/intents/ */
    constructor()
    {
        /**@type {Number} */
        this.intents = 0
    }

    /**Gives guild control (create/delete guild, roles, threads and channels) */
    guilds() {
        this.intents = this.intents | (1 << 0)
        return this
    }

    /**PRIVILEGED INTENT
     * 
     * Gives guild members control (add/update/remove members) 
    */
    p_guild_members() {
        this.intents = this.intents | (1 << 1)
        return this
    }

    /**Gives guild ban control */
    guild_bans() {
        this.intents = this.intents | (1 << 2)
        return this
    }

    /**Gives emoji and stickers control */
    guild_emojis_and_stickers() {
        this.intents = this.intents | (1 << 3)
        return this
    }

    /**Gives integrations control */
    guild_integrations() {
        this.intents = this.intents | (1 << 4)
        return this
    }

    /**Gives webhooks control */
    guild_webhooks() {
        this.intents = this.intents | (1 << 5)
        return this
    }

    /**Gives invite control */
    guid_invites() {
        this.intents = this.intents | (1 << 6)
        return this
    }

    /**Gives voice state update control */
    guild_voice_states() {
        this.intents = this.intents | (1 << 7)
        return this
    }

    /**PRIVILEGED INTENT
     * 
     * Gives user presence updates */
    p_guild_presences() {
        this.intents = this.intents | (1 << 8)
        return this
    }

    /**Gives message create, update and deletion control*/
    guild_messages() {
        this.intents = this.intents | (1 << 9)
        return this
    }

    /**Gives reactions control */
    guild_message_reactions() {
        this.intents = this.intents | (1 << 10)
        return this
    }

    /**Gives typing start event */
    guild_message_typing() {
        this.intents = this.intents | (1 << 11)
        return this
    }

    /**Gives DMs control */
    direct_messages() {
        this.intents = this.intents | (1 << 12)
        return this
    }

    /**Gives DM reactions control */
    direct_messages_reactions() {
        this.intents = this.intents | (1 << 13)
        return this
    }

    /**Gives DM starting typing event */
    direct_messages_typing() {
        this.intents = this.intents | (1 << 14)
        return this
    }

    /**PRIVILEGED INTENT
     * 
     * Gives message content when messages are sent
     */
    p_message_content() {
        this.intents = this.intents | (1 << 15)
        return this
    }

    /**Gives control for guild events */
    guild_scheduled_events() {
        this.intents = this.intents | (1 << 16)
        return this
    }

    /**returns a number to send as intents */
    parse() {
        console.log(this.intents)
        return this.intents
    }
}

module.exports = { Intents }
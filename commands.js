const fetch = require('node-fetch')
const enums = require('./discordEnums.js')
const fs = require('fs')
require('dotenv').config()

const COMMANDS = []

COMMANDS.push({ //0
    "name": "server-info",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Get information about the Minecraft server",
})

COMMANDS.push({ //1
    "name": "ping",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Pings server for testing purposes"
})

COMMANDS.push({ //2
    "name": "list",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Lists active players on the Minecraft server"
})

COMMANDS.push({ //3
    "name": "jfr",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Controls a JFR session",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.NUMBER,
            "name": "runtime",
            "description": "Select how long the JFR session should last (in seconds)",
            "required": true,
            "min_value": 15,
            "max_value": 600
        }
    ]
})

COMMANDS.push({ //4
    "name": "jfr-stop",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Stops a JFR session if one is active"
})

COMMANDS.push({ //5
    "name": "allow-idling",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Allows idling until the player who has executed the command leaves the game"
})

COMMANDS.push({ //6
    "name": "server-time",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Shows the server control timers"
})

COMMANDS.push({ //7
    "name": "ping-daytime",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Pings player who executed command when the server reaches daytime"
})

COMMANDS.push({ //8
    "name": "whisper",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Allows you to message in-game players",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.SUB_COMMAND,
            "name": "everyone",
            "description": "Message everyone",
            "options": [
                {
                    "type": enums.ApplicationSubCommandType.STRING,
                    "name": "message",
                    "description": "message to send",
                    "max_length": 256,
                    "required": true
                }
            ]
        },
    //     {
    //         "type": enums.ApplicationSubCommandType.SUB_COMMAND_GROUP,
    //         "name": "player",
    //         "description": "Message a player",
    //         "options": []
    //     },
    //     {
    //         "type": enums.ApplicationSubCommandType.SUB_COMMAND,
    //         "name": "team",
    //         "description": "Message a team",
    //         "options": [
    //             {
                    
    //             }
    //         ]
    //     }
    ]
})

COMMANDS.push({ //9
    "name": "cmd",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Enter a command to execute on the server",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.STRING,
            "name": "command",
            "description": "Command to execute on the server",
            "max_length": 256,
            "required": true,
        }
    ]
})

COMMANDS.push({ //10
    "name": "whitelist",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Manages or shows whitelist",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.SUB_COMMAND_GROUP,
            "name": "remove",
            "description": "Removes a player from the whitelist",
            "options": [
                {
                    "type": enums.ApplicationSubCommandType.SUB_COMMAND,
                    "name": "ip",
                    "description": "Remove an IP from the whitelist",
                    "options": [
                        {
                            "type": enums.ApplicationSubCommandType.STRING,
                            "name": "ip",
                            "description": "IP to remove from whitelist",
                            "required": true
                        }
                    ]
                },
                {
                    "type": enums.ApplicationSubCommandType.SUB_COMMAND,
                    "name": "name",
                    "description": "Remove a Minecraft name from the whitelist",
                    "options": [
                        {
                            "type": enums.ApplicationSubCommandType.STRING,
                            "name": "name",
                            "description": "Name to remove from whitelist",
                            "required": true
                        }
                    ]
                }
            ]
        },
        {
            "type": enums.ApplicationSubCommandType.SUB_COMMAND,
            "name": "add",
            "description": "Adds a player to the whitelist",
            "options": [
                {
                    "type": enums.ApplicationSubCommandType.STRING,
                    "name": "ip",
                    "description": "IP of the user to whitelist",
                    "required": true
                },
                {
                    "type": enums.ApplicationSubCommandType.STRING,
                    "name": "name",
                    "description": "Minecraft name of the user to whitelist",
                    "required": true
                }
            ]
        },
        {
            "type": enums.ApplicationSubCommandType.SUB_COMMAND,
            "name": "list",
            "description": "Lists whitelisted players"
        }
    ]
})

COMMANDS.push({ //11
    "name": "logs",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "DMs server logs",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.STRING,
            "name": "start_date",
            "description": "Starting date for the logs, format as YYYY-MM-DD",
            "required": true,
            "max_length": 10
        },
        {
            "type": enums.ApplicationSubCommandType.STRING,
            "name": "end_date",
            "description": "Ending date for the logs, format as YYYY-MM-DD",
            "max_length": 10
        }
    ]
})

COMMANDS.push({ //12
    "name": "restart",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Restarts server (with cooldown per person (once every 24h) and globally (once every 15m)",
    "options": [
        {
            "type": enums.ApplicationSubCommandType.BOOLEAN,
            "name": "backup",
            "description": "Backup while restarting?"
        }
    ]
})

COMMANDS.push({ //13
    "name": "stop",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Stops server"
})

COMMANDS.push({ //14
    "name": "screenshot",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Screenshots server environnement and sends result in"
})

COMMANDS.push({ //15
    "name": "debug",
    "type": enums.ApplicationCommandType.CHAT_INPUT,
    "description": "Sends useful information about the servers running"
})

//CreateCommand(8)
GetCommands()

function CreateCommand(commandIndex) {
    fetch(`https://discord.com/api/v10/applications/${process.env.APP_ID}/commands`, {
        method: "POST",
        headers: {
            "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(COMMANDS[commandIndex])
    })
        .then(async res => {
            console.log(`${res.status} - ${res.statusText}`)
            if (res.status == 429) {
                res = await res.text()
                res = JSON.parse(res)
                console.log(res)
                res = JSON.stringify(res, null, "\t")
                fs.writeFileSync("./429errorLog", res, 'utf-8')
            }
        })
        .catch(err => {
            console.log(err)
        })
}

async function GetCommands() {
    fetch(`https://discord.com/api/v10/applications/${process.env.APP_ID}/commands`, {
        method: "GET",
        headers: {
            "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
            'Accept': 'application/json; charset=UTF-8'
        }
    })
    .then(async res => {
        res = await res.text()
        res = JSON.parse(res)
        console.log(res)
        console.log(res.length)
        res = JSON.stringify(res, null, "\t")
        fs.writeFileSync("./debugs/currentCommands.json", res, 'utf-8')
    })
}

function GenerateChoicesForWhisperCommand() {
    let whitelistFilePath = process.env.WHITELIST_FILE_PATH
}
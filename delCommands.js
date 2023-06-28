const fetch = require('node-fetch')
require('dotenv').config()
const process = require('process')

const commandID = process.argv[2] //KEEP AS STRING due to Integer limit

fetch(`https://discord.com/api/v10/applications/${process.env.APP_ID}/commands/${commandID}`, {
    method: "DELETE",
    headers: {
        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
    }
    })
        .then(async res => {
            console.log(`${res.status} - ${res.statusText}`)
        })
        .catch(err => {
            console.log(err)
        })

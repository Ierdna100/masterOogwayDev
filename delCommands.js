const fetch = require('node-fetch')
require('dotenv').config()
const process = require('process')
const { DiscordRequest, HTTPMethods } = require('./http/discordRequest.js')

const commandID = process.argv[2] //KEEP AS STRING due to Integer limit

const res = DiscordRequest(`/applications/${process.env.APP_ID}/commands/${commandID}`, HTTPMethods.DELETE)

if (res.status == "204") {
    console.log(`Command with ID ${commandID} was sucessefully deleted.`)
}
else {
    console.log("An error occured trying to delete the command.")
    console.log(res)
}
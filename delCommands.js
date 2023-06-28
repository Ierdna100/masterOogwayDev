const fetch = require('node-fetch')
require('dotenv').config()
const process = require('process')
const { DiscordRequest, HTTPMethods } = require('./discordRequest.js')

const commandID = process.argv[2] //KEEP AS STRING due to Integer limit

DiscordRequest(`${process.env.APP_ID}/commands/${commandID}`, HTTPMethods.DELETE)
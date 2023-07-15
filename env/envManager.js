const fs = require('fs')
const { GetGatewayURL } = require('../http/discordRequest.js')

function AddVariableToEnvFile(key, value) {
    let file = fs.readFileSync("./.env").toString()
    let splitter

    if (process.platform == 'win32') //windows separates newlines differently
    {
        splitter = "\r\n"
    }
    else
    {
        splitter = "\n"
    }

    file = file.split(splitter)
  
    file.forEach((element, index) => {
        file[index] = element.split("=")
    });

    let keyAlreadyExistsAtIndex = -1

    file.forEach((element, index) => {
        if (element[0] == key) {
            keyAlreadyExistsAtIndex = index
        }
    })

    if (keyAlreadyExistsAtIndex != -1) 
    {
        file[keyAlreadyExistsAtIndex][1] = value
        //console.log(`Variable already exists, assigning ${value} to it`)
    }
    else 
    {
        file.push([key, value])
        //console.log(`Variable didn't already exist, assigning ${[key, value]} to it`)
    }

    let writeData = ""

    file.forEach(element => {
        writeData = writeData + `${element[0]}=${element[1]}${splitter}`
    })

    writeData = writeData.substring(0, writeData.length - splitter.length) //remvoes the extra \r\n

    fs.writeFileSync("./.env", writeData)
}

async function checkIfURLIdentExists()
{
    if (!process.env.SOCKET_URL) 
    {
        let newURL = await GetGatewayURL()
        console.log(`RECEIVED GATEWAY URL: ${newURL}`)
        process.env.SOCKET_URL = newURL //temporary, for this session only
        AddVariableToEnvFile("SOCKET_URL", newURL) // applies next session after dotenv is reconfigured
    }
}

module.exports = { AddVariableToEnvFile, checkIfURLIdentExists }
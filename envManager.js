const fs = require('fs')

function AddVariableToEnvFile(key, value) {
    let file = fs.readFileSync("./.env").toString()

    file = file.split("\r\n")
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
        writeData = writeData + `${element[0]}=${element[1]}\r\n`
    })

    writeData = writeData.substring(0, writeData.length - 2) //remvoes the extra \r\n

    fs.writeFileSync("./.env", writeData)
}

module.exports = { AddVariableToEnvFile }
const fs = require('fs')

class Logger {
    constructor() {
        this.logger
        this.Init()
    }

    Log(message) {
        message = `${this.GenerateTimeStamp()} [INFO] ${JSON.stringify(message)}`
        this.logger.write(`${message}\r\n`)
        console.log(message)
    }

    Warn(message) {
        message = `${this.GenerateTimeStamp()} [WARN] ${JSON.stringify(message)}`
        this.logger.write(`${message}\r\n`)
        console.warn(message)
    }

    Error(message) {
        message = `${this.GenerateTimeStamp()} [ERROR] ${JSON.stringify(message)}`
        this.logger.write(`${message}\r\n`)
        console.error(message)
    }

    Custom(title, message) {
        message = `${this.GenerateTimeStamp()} [${title.toUpperCase()}] ${JSON.stringify(message)}`
        this.logger.write(`${message}\r\n`)
        console.log(message)
    }

    GenerateTimeStamp() {
        let t = new Date()
        return `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}.${Math.floor((t.getMilliseconds()) / 10).toString().padStart(2, "0")}`
    } //Timestamp appears as: 23:59:59.00

    GenerateFileName() {
        let t = new Date()
        return `Logs ${t.getFullYear()}-${t.getMonth()}-${t.getDay()}.txt`
    }

    Init() {
        if (!fs.existsSync('./logs/')) {
            fs.mkdirSync('./logs/')
        }

        let filename = this.GenerateFileName()
        this.logger = fs.createWriteStream(`./logs/${filename}`, 'utf-8', 'as')

        const lengthOfADayInMillisec = 24 * 60 * 60 * 1000 //24hrs, 60 mins, 60 secs, 1000 millisecs
        const lengthOfAMinuteInMillisec = 60 * 1000 //60 secs, 1000 millisecs
        let d = new Date()
        let currentDayTimeInMillisec = lengthOfADayInMillisec - ((d.valueOf() - (d.getTimezoneOffset() * lengthOfAMinuteInMillisec)) % lengthOfADayInMillisec)

        setTimeout(this.End, currentDayTimeInMillisec + 20) //20 is a margin of error, but honestly doesn't matter that much
    }

    End() { //changes to a new file with a new date written on it
        this.logger.close()
        this.Init()
    }
}

module.exports = { Logger }
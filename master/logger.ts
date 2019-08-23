import * as winston from "winston"

const { combine, timestamp, printf } = winston.format

const myFormat = printf(({ timestamp, message }) => {
    return `[${timestamp}] ${message}`
})

export default winston.createLogger({
    format: combine(
        timestamp(),
        myFormat,
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: "info",
            filename: "public/access.log",
        }),
    ],
})

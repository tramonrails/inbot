import * as socketIO from "socket.io"
import * as fs from "fs"
import * as puppeteer from "puppeteer"
import * as express from "express"
import * as serveIndex from "serve-index"

import logger from "./logger"


const app = express()
app.use("/public", express.static(__dirname + "/../public"), serveIndex(__dirname + "/../public"))
app.listen(3000, () => logger.info("Express listening on port 3000!"))

let io
let browser
const launch = async () => {
    browser = await puppeteer.launch({
        args: ["--no-sandbox", "--headless", "--disable-gpu", "--disable-dev-shm-usage"],
    })
    await startIoServer()
}

const startIoServer = async () => {
    logger.info("io started")
    io = socketIO.listen(5000)
    io.on("connection", socket => {
        const agent = socket.handshake
        logger.info(`${agent.address} ${agent.headers["user-agent"]}  – New connection`)

        socket.on("json", data => {
            data.json.forEach(async (query) => {
                const page = await browser.newPage()
                await page.goto(query.query)
                const resultStats = await page.evaluate(() => document.getElementById("resultStats").textContent)
                await page.close()
                logger.info(`${agent.address} ${agent.headers["user-agent"]}  – New JSON: ${query.query}, ${resultStats}`)
            })
        })

        socket.on("raw", data => {
            logger.info(`${agent.address} ${agent.headers["user-agent"]}  – New RAW: ${data.raw}`)
        })

        socket.on("images", data => {
            data.images.forEach(image => {
                fs.writeFile("./public/" + image.name, image.image, (err => {
                    if (err) {
                        console.log(err)
                    }
                    logger.info(
                        `${agent.address} ${agent.headers["user-agent"]}  – New images http://localhost:3000/public/${image.name}`,
                    )
                }))
            })
        })
    })

}

const restartIoServer = async () => {
    io.close()
    logger.info("io server closed and will restart in five seconds")
    await wait(5000)
    await startIoServer()
}

setInterval(restartIoServer, 15000)

const wait = (time) => {
    return new Promise((resolve => {
        setTimeout(() => resolve(), time)
    }))
}

launch()

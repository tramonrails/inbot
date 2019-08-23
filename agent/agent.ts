import * as io from "socket.io-client"
import data from "./data"


const connectToMaster = () => {
    const socket = io.connect("http://master:5000")

    socket.on("connect", () => {
        console.log("connected to server")
        sendWithInterval(socket)
    })
}

const sendWithInterval = (socket) => {
    let index = 0
    setInterval(function() {
        let i = index++
        socket.emit(`${Object.keys(data[i])}`, data[i])
        if (index === data.length) {
            index = 0
        }
    }, 2000)
}

connectToMaster()

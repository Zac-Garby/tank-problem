#!/usr/bin/env node

let express = require("express")
let app = express()
let http = require("http").Server(app)
let io = require("socket.io")(http)

let root = __dirname + "/../public"

app.use(express.static(root))

app.get("/", (req, res) => {
    res.sendFile("index.html")
})

app.get("/client", (req, res) => {
    res.sendFile("client/index.html")
})

app.get("/room", (req, res) => {
    res.sendFile("room/index.html")
})

http.listen(3000, () => {
    console.log("listening on *:3000")
})

// room name: room owner's id
let rooms = {}

// id: {name, room name}
let clients = {}

// id: socket
let sockets = {}

// The server essentially routes the controllers' inputs
// to the room owners.
io.on("connection", socket => {
    let isPlayer = false
    let room, info

    socket.on("client info", i => {
        console.log(`Received client info: ${i.name} in ${i.room}`)

        isPlayer = true
        info = i
        clients[socket.client.id] = info
        sockets[socket.client.id] = socket

        io.to(rooms[info.room]).emit("joined", socket.client.id, info)
    })

    socket.on("disconnect", () => {
        if (!isPlayer) {
            delete rooms[room]
            console.log(`Room destroyed: ${room}`);
        } else {
            delete clients[socket.client.id]
            delete sockets[socket.client.id]
            io.to(rooms[info.room]).emit("left", socket.client.id)
            console.log(`Client left: ${info.name}`)
        }
    })

    socket.on("room exists?", (room, callback) => {
        callback(rooms[room] !== undefined)
    })

    socket.on("input", (type, up) => {
        if (!clients[socket.client.id] || !type) return

        let room = clients[socket.client.id].room
        io.to(rooms[room]).emit("input", socket.client.id, type, up)
    })

    socket.on("new room", name => {
        console.log(`Room created: ${name}`)

        room = name
        rooms[name] = socket.client.id
    })

    socket.on("kick", id => {
        sockets[id].disconnect()
    })
})
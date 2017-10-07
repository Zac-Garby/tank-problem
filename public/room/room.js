require.config({
    baseUrl: "./",
    packages: [
        {
            name: "physicsjs",
            location: "lib/physicsjs",
            main: "physicsjs.min.js"
        }
    ],
    paths: {
        "pixi": "lib/pixi"
    }
})

require([
    "/socket.io/socket.io.js",
    "engine/main.js"
], (io, engine) => {
    "use strict";
    
    const url = new URL(location.href)
    let room = url.searchParams.get("room")

    let socket = io()
    io = undefined

    document.getElementById("back").href = url.origin

    socket.emit("room exists?", room, exists => {
        if (exists) {
            let wrapper = document.createElement("div")
            wrapper.className = "fade wrapper"

            let h1 = document.createElement("h1")
            h1.innerHTML = `The room '${room}' already exists`

            let h2 = document.createElement("h2")
            h2.innerHTML = `Click <a href=${url.origin}>here</a> to return to the main page`

            wrapper.appendChild(h1)
            wrapper.appendChild(h2)
            
            document.body.appendChild(wrapper)
        } else {
            document.getElementById("room-name").innerHTML = room

            let playerList = document.getElementById("users")

            socket.on("joined", (id, info) => {
                let li = document.createElement("li")
                li.innerHTML = info.name
                li.id = id

                li.onclick = () => {
                    socket.emit("kick", id)
                }

                playerList.appendChild(li)
            })

            socket.on("left", id => {
                let li = document.getElementById(id)
                if (!li) return

                playerList.removeChild(li)
            })

            socket.emit("new room", room)

            engine(socket)
        }
    })
})

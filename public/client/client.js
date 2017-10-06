(() => {
    "use strict";

    const url = new URL(location.href)
    let name = url.searchParams.get("name")
    let room = url.searchParams.get("room")

    let socket = io()
    io = undefined

    document.getElementById("back").href = url.origin

    socket.emit("room exists?", room, exists => {
        if (!exists) {
            let wrapper = document.createElement("div")
            wrapper.className = "wrapper"

            let h1 = document.createElement("h1")
            h1.innerHTML = `The room '${room}' doesn't exist`

            let h2 = document.createElement("h2")
            h2.innerHTML = `Click <a href=${url.origin}>here</a> to return to the main page`

            wrapper.appendChild(h1)
            wrapper.appendChild(h2)
            
            document.body.appendChild(wrapper)
        } else {
            socket.emit("client info", {
                name: name,
                room: room,
            })

            let buttons = [
                "A",
                "B",

                "up",
                "down",
                "left",
                "right",
            ]

            for (let id of buttons) {
                let elem = document.getElementById(id)

                elem.addEventListener("mousedown", () => {
                    socket.emit("input", id, true)
                })

                elem.addEventListener("mouseup", () => {
                    socket.emit("input", id, false)
                })
            }

            let keys = {
                90: "A",
                88: "B",

                38: "up",
                40: "down",
                37: "left",
                39: "right",
            }

            window.addEventListener("keydown", evt => {
                socket.emit("input", keys[evt.keyCode], true)
            })

            window.addEventListener("keyup", evt => {
                socket.emit("input", keys[evt.keyCode], false)
            })
        }
    })
})()
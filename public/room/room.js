(() => {
    "use strict";

    const url = new URL(location.href)
    let room = url.searchParams.get("room")

    let socket = io()
    io = undefined

    document.getElementById("back").href = url.origin

    socket.emit("room exists?", room, exists => {
        if (exists) {
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
            document.getElementById("room-name").innerHTML = room

            socket.emit("new room", room)

            game(socket)
        }
    })
})()
let A = document.getElementById("A")
let B = document.getElementById("B")

let up = document.getElementById("up")
let down = document.getElementById("down")
let left = document.getElementById("left")
let right = document.getElementById("right")

function getElem(code) {
    switch (code) {
        case 37:
            return left
        case 38:
            return up
        case 39:
            return right
        case 40:
            return down
        
        case 90:
            return A
        case 88:
            return B
        default:
            return undefined
    }
}

window.addEventListener("keydown", evt => {
    let elem = getElem(evt.keyCode)
    if (elem === undefined) return

    elem.classList.add("active")
})

window.addEventListener("keyup", evt => {
    let elem = getElem(evt.keyCode)
    if (elem === undefined) return
    
    elem.classList.remove("active")
})
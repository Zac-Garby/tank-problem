define([
    "require",

    "physicsjs",
    "pixi",

    "physicsjs/renderers/pixi-renderer",
    "physicsjs/bodies/rectangle",
    "physicsjs/behaviors/sweep-prune",
    "physicsjs/behaviors/body-collision-detection",
    "physicsjs/behaviors/body-impulse-response",
    "physicsjs/behaviors/edge-collision-detection",
    "engine/tank-controls"
], (require, Physics, PIXI) => {
    return (socket) => Physics(world => {
        Physics.util.ticker.on(time => {
            world.step(time)
        })

        Physics.util.ticker.start()

        let viewportBounds = Physics.aabb(0, 0, 1200, 800)
        let tanks = {}
        let controllers = {}

        world.add([
            Physics.behavior("edge-collision-detection", {
                aabb: viewportBounds,
                restitution: 1,
                cof: 1
            }),
            Physics.behavior("body-impulse-response"),
            Physics.behavior("body-collision-detection"),
            Physics.integrator("verlet", {
                drag: 0.5
            })
        ])

        let renderer = Physics.renderer("pixi", {
            // el: "game",
            width: 1200,
            height: 800,
            // meta: false,
            autoResize: false
        })

        socket.on("joined", (id, info) => {
            let body = Physics.body("rectangle", {
                x: 200,
                y: 200,
                width: 50,
                height: 40
            })

            let controls = Physics.behavior("tank-controls", {
                tank: body,
                socket: socket,
                id: id
            })

            tanks[id] = body
            controllers[id] = controls

            world.add([
                body,
                controls
            ])
        })

        socket.on("left", id => {
            world.remove([
                tanks[id],
                controllers[id]
            ])
        })

        world.add(renderer)

        world.on("step", () => {
            world.render()
        })
    })
})
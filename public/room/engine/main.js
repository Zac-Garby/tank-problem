Physics(world => {
    let renderer = Physics.renderer("canvas", {
        el: "game",
        width: 1200,
        height: 800,
        autoResize: false,
        styles: {
            "rectangle": {
                fillStyle: "black",
                angleIndicator: "rgba(0, 0, 0, 0)",
            },
        },
    })

    world.add(renderer)

    let bounds = Physics.aabb(0, 0, 1200, 800)
    
    world.add(Physics.behavior("edge-collision-detection", {
        aabb: bounds
    }))

    world.add(Physics.integrator("verlet", {
        drag: 0.7
    }))

    world.add(Physics.behavior("body-impulse-response"))
    world.add(Physics.behavior('body-collision-detection'))
    world.add(Physics.behavior('sweep-prune'))

    let square = Physics.body("rectangle", {
        x: 250,
        y: 250,
        width: 50,
        height: 50,
        mass: 100,
        restitution: 0,
    })

    world.add(square)
    
    world.on("step", () => {
        world.render()
    })

    Physics.util.ticker.on((time, dt) => {
        world.step(time)
    })

    Physics.util.ticker.start()
})
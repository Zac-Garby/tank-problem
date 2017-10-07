define([
    "require",
    "physicsjs",

    "physicsjs/bodies/circle"
], (require, Physics) => {
    "use strict";
    
    return Physics.behavior("tank-controls", function(parent) {
        return {
            init: function(options) {
                this.tank = options.tank
                this.id = options.id
                this.lastShot = -Infinity

                this.input = {}

                options.socket.on("input", (id, type, up) => {
                    if (id == this.id) {
                        if (type == "A") {
                            this.shoot()
                        } else {
                            this.input[type] = up
                        }
                    }
                })
            },

            connect: function(world) {
                this.world = world
                world.on("integrate:positions", this.behave, this)
            },

            disconnect: function(world) {
                world.off("integrate:positions", this.behave)
            },

            behave: function() {
                let scratch = Physics.scratchpad()
                
                let speed = 0
                
                if (this.input["up"]) {
                    speed = 0.003
                } else if (this.input["down"]) {
                    speed = -0.003
                } else {
                    speed = 0
                }

                if (this.input["left"]) {
                    this.tank.state.angular.vel = -0.0025
                } else if (this.input["right"]) {
                    this.tank.state.angular.vel = 0.0025
                } else {
                    this.tank.state.angular.vel = 0
                }

                let v = scratch.vector().set(
                    speed * Math.cos(this.tank.state.angular.pos),
                    speed * Math.sin(this.tank.state.angular.pos)
                )

                this.tank.accelerate(v)

                this.tank.state.vel.x *= 0.9
                this.tank.state.vel.y *= 0.9

                scratch.done()

                if (this.tank.sleep()) this.tank.sleep(false)           
            },

            shoot: function() {
                let time = Date.now()
                if (time - this.lastShot < 500) return
                this.lastShot = time

                let scratch = Physics.scratchpad()

                let v = scratch.vector().set(
                    20 * Math.cos(this.tank.state.angular.pos),
                    20 * Math.sin(this.tank.state.angular.pos)
                )

                let bullet = Physics.body("circle", {
                    x: this.tank.state.pos.x + v.x,
                    y: this.tank.state.pos.y + v.y,
                    vx: v.x / 40,
                    vy: v.y / 40,
                    radius: 5,
                    restitution: 1
                })

                this.world.add(bullet)

                // Remove the bullet after 10s
                window.setInterval(() => this.world.remove(bullet), 10000)

                scratch.done()
            }
        }
    })
})
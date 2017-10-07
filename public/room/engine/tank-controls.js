define([
    "require",
    "physicsjs"
], (require, Physics) => {
    "use strict";
    
    return Physics.behavior("tank-controls", function(parent) {
        return {
            init: function(options) {
                this.tank = options.tank
                this.id = options.id

                this.input = {}

                options.socket.on("input", (id, type, up) => {
                    if (id == this.id) {
                        this.input[type] = up
                    }
                })
            },

            connect: function(world) {
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
                scratch.done()

                if (this.tank.sleep()) this.tank.sleep(false)           
            }
        }
    })
})
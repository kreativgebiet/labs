var canvas;

function randomNorm(mean, stdev) {
  return Math.abs(Math.round((Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)) * stdev) + mean;
}

class Canvas {
  constructor() {
    this.opts = {
      width        : 4000,
      height       : 2600,
      particleCount: 150,
      sizes        : [ 3, 4, 6 ],
      colors       : [ '#9013fe', '#50e3c2', '#f8e71c', '#b8e986', '#8b572a', '#d0021b' ]
    }

    this.active = true;
    this.particles = []; // Initialize empty particles array

    this.canvas  = document.querySelector('.particles');
    this.ctx     = this.canvas.getContext("2d");

    this.canvas.width  = this.opts.width;
    this.canvas.height = this.opts.height;

    this.initializeParticles();
    this.drawParticles();

    requestAnimationFrame(this.animateParticles.bind(this));
  }

  initializeParticles() {
    for (var i = this.opts.particleCount - 1; i >= 0; i--) {
      var p = new Particle(this.ctx, this.opts);
      this.particles.push(p);
    }
  }

  drawParticles() {
    for (var i = this.opts.particleCount - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.draw();
    }
  }

  updateParticles() {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.move();
      p.boundaryCheck();
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.opts.width, this.opts.height);
  }

  activate() {
    this.active = true;
    this.animateParticles();
  }

  deactivate() {
    this.active = false;
  }

  destroy() {
    var that = this;

    this.deactivate();
    setTimeout(function() {
      that.clearCanvas();
    }, 100);
  }

  animateParticles() {
    this.clearCanvas();
    this.drawParticles();
    this.updateParticles();

    if( this.active ) {
      requestAnimationFrame(this.animateParticles.bind(this));
    }
  }

  updateBoundaries() {
    for (var i=0; i<this.particles.length; i++) {
      this.particles[i].opts.width = this.opts.width;
      this.particles[i].opts.height = this.opts.height;
    }
  }
};


class Particle {
  constructor(context, opts) {
    this.ctx   = context
    this.opts  = opts;

    var colorRand = Math.floor((Math.random() * opts.colors.length));
    var sizeRand = Math.floor((Math.random() * opts.sizes.length));

    this.color = opts.colors[colorRand];
    this.size  = opts.sizes[sizeRand];

    console.log(this.color, this.size);

    this.x     = Math.random() * this.opts.width
    this.y     = Math.random() * this.opts.height

    this.vx = (2 * Math.random() + 4) * .01 * this.size;
    this.vy = (2 * Math.random() + 4) * .01 * this.size;

    this.direction = {
      x: -1 * Math.random() * 2,
      y: -1 * Math.random() * 2
    };
  }

  move() {
    this.x += this.vx * this.direction.x;
    this.y += this.vy * this.direction.y;
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.x, this.y);
    this.ctx.fillStyle = this.color;
    this.ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.restore();
  }

  changeDirection(axis) {
    this.direction[axis] *= -1;
  }

  boundaryCheck() {
    if (this.x >= this.opts.width*1.2) {
      this.x = this.opts.width*1.2;
      this.changeDirection("x");
    } else if (this.x <= -this.opts.width*0.2) {
      this.x = -this.opts.width*0.2;
      this.changeDirection("x");
    }

    if (this.y >= this.opts.height*1.2) {
      this.y = this.opts.height*1.2;
      this.changeDirection("y");
    } else if (this.y <= -this.opts.height*0.2) {
      this.y = -this.opts.height*0.2;
      this.changeDirection("y");
    }
  }
};

canvas = new Canvas();

// window.onresize = evt => {
//   canvas.destroy();
//   canvas = new Canvas();
// };

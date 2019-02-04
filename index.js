function randomNumBetween(min, max) {
  return min + Math.random() * (max - min);
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  copy() {
    return new Vector(this.x, this.y);
  }
  static random(minX, maxX, minY, maxY) {
    return new Vector(
      randomNumBetween(minX, maxX),
      randomNumBetween(minY, maxY)
    );
  }
}

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.radius = 20;
  }
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
}

class Canvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.canvas.width = 800;
    this.canvas.height = 800;
    this.setup();
    requestAnimationFrame(() => this.update());
  }
  setup() {
    const NUM_PARTICLES = 2;
    this.particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      this.particles.push(new Particle(
        randomNumBetween(0, this.canvas.width),
        randomNumBetween(0, this.canvas.height),
      ));
    }
  }
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let particle of this.particles) {
      particle.update();

      this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      this.ctx.beginPath();
      this.ctx.arc(
        particle.pos.x, 
        particle.pos.y,
        particle.radius,
        0, 
        2 * Math.PI
      );
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.update());
  }
}

new Canvas();

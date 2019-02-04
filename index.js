function randomNumBetween(min, max) {
  return min + Math.random() * (max - min);
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static add(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }
  static mult(vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
  }
  static div(vector, scalar) {
    return new Vector(vector.x / scalar, vector.y / scalar);
  }
  static sub(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  getTangent() {
    return new Vector(-this.y, this.x);
  }
  mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
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
    this.vel = Vector.random(-1, 1, -1, 1);
    this.acc = new Vector(0, 0);
    this.radius = randomNumBetween(5, 50);
  }
  update() {
    this.pos = Vector.add(this.pos, this.vel);
    this.vel = Vector.add(this.vel, this.acc);
    this.acc = Vector.mult(this.acc, 0);
  }
  checkCollision(particle) {
    const v = Vector.sub(this.pos, particle.pos);
    const dist = v.mag();
    if (dist <= this.radius + particle.radius) {
      const unitNormal = Vector.div(v, v.mag());
      const unitTangent = unitNormal.getTangent();

      const correction = Vector.mult(unitNormal, this.radius + particle.radius);
      const newV = Vector.add(particle.pos, correction);
      this.pos = newV;

      const a = this.vel;
      const b = particle.vel;

      const a_n = a.dot(unitNormal);
      const b_n = b.dot(unitNormal);
      const a_t = a.dot(unitTangent);
      const b_t = b.dot(unitTangent);

      const a_n_final = (a_n * (this.radius - particle.radius) +
        2 * particle.radius*b_n) / (this.radius + particle.radius);
      const b_n_final = (b_n * (particle.radius - this.radius) + 
        2 * this.radius * a_n) / (this.radius + particle.radius);

      const a_n_after = Vector.mult(unitNormal, a_n_final);
      const b_n_after = Vector.mult(unitNormal, b_n_final);
      const a_t_after = Vector.mult(unitTangent, a_t);
      const b_t_after = Vector.mult(unitTangent, b_t);

      const a_after = Vector.add(a_n_after, a_t_after);
      const b_after = Vector.add(b_n_after, b_t_after);

      this.vel = a_after;
      particle.vel = b_after;
    }
  }
  handleEdges(width, height) {
    if (this.pos.x - this.radius <= 0 || this.pos.x + this.radius >= width) {
      this.vel.x = -this.vel.x;
    } else if (this.pos.y - this.radius <= 0 || this.pos.y + this.radius >= height) {
      this.vel.y = -this.vel.y;
    }
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
    const NUM_PARTICLES = 100;
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

    for (let i = 0; i < this.particles.length; i++) {
      const current = this.particles[i];
      const rest = this.particles.slice(i + 1);

      for (let p of rest) {
        p.checkCollision(current);
      }
    }

    for (let particle of this.particles) {
      particle.update();
      particle.handleEdges(this.canvas.width, this.canvas.height);

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

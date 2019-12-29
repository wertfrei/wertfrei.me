export class Vector {
  constructor(public x = 0, public y = 0) {}

  static fromEdge({ p1, p2 }: Edge) {
    return [new Vector(p1.x, p1.y), p2.minus(p1)]
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  add(vec: Vector) {
    return new Vector(this.x + vec.x, this.y + vec.y)
  }

  minus(vec: Vector) {
    return new Vector(this.x - vec.x, this.y - vec.y)
  }

  map(func: (v: number) => number) {
    return new Vector(...[this.x, this.y].map(func))
  }

  set(x = this.x, y = this.y) {
    this.x = x
    this.y = y
  }

  get values(): [number, number] {
    return [this.x, this.y]
  }
}

export interface Edge {
  p1: Vector
  p2: Vector
}

export class Polygon {
  vertices: Vector[]
  diagonal?: Edge

  constructor(vertices: (Vector | [number, number])[] = []) {
    this.vertices = vertices.map(v =>
      !Array.isArray(v) ? v : new Vector(v[0], v[1])
    )
  }

  get edges(): Edge[] {
    const vertices = [...this.vertices, this.vertices[0]]
    return vertices
      .slice(0, -1)
      .map((_, i) => ({ p1: vertices[i], p2: vertices[i + 1] }))
  }
  get perimeter() {
    return this.edges
      .map(Vector.fromEdge)
      .map(([, dir]) => dir.magnitude)
      .reduce((a, b) => a + b)
  }
}

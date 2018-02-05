/**
* Linearise by row
*/

export default class ReactionDiffusionGrid {
  constructor (height, width) {
    this.height = height
    this.width = width
    this.length = this.height * this.width
    this.a = new Array(this.length).fill(0)
    this.b = new Array(this.length).fill(0)
  }

  laplacienA (x, y) {
    let i = (y * this.width + x) % this.length
    i = i < 0 ? i + this.length : i

    return (
      (
        this.a[(i + this.length - 1) % this.length] +
        this.a[(i + 1) % this.length] +
        this.a[(i + this.length - this.width) % this.length] +
        this.a[(i + this.width) % this.length]
      ) * 0.2 + (
        this.a[(i + this.length - 1 - this.width) % this.length] +
        this.a[(i + this.length + 1 - this.width) % this.length] +
        this.a[(i + this.length - 1 + this.width) % this.length] +
        this.a[(i + 1 + this.width) % this.length]
      ) * 0.05 - this.a[i]
    )
  }

  laplacienB (x, y) {
    let i = (y * this.width + x) % this.length
    i = i < 0 ? i + this.length : i

    return (
      (
        this.b[(i + this.length - 1) % this.length] +
        this.b[(i + 1) % this.length] +
        this.b[(i + this.length - this.width) % this.length] +
        this.b[(i + this.width) % this.length]
      ) * 0.2 + (
        this.b[(i + this.length - 1 - this.width) % this.length] +
        this.b[(i + this.length + 1 - this.width) % this.length] +
        this.b[(i + this.length - 1 + this.width) % this.length] +
        this.b[(i + 1 + this.width) % this.length]
      ) * 0.05 - this.b[i]
    )
  }

  _laplacienA (i) {
    return (
      (
        this.a[(i + this.length - 1) % this.length] +
        this.a[(i + 1) % this.length] +
        this.a[(i + this.length - this.width) % this.length] +
        this.a[(i + this.width) % this.length]
      ) * 0.2 + (
        this.a[(i + this.length - 1 - this.width) % this.length] +
        this.a[(i + this.length + 1 - this.width) % this.length] +
        this.a[(i + this.length - 1 + this.width) % this.length] +
        this.a[(i + 1 + this.width) % this.length]
      ) * 0.05 - this.a[i]
    )
  }

  _laplacienB (i) {
    return (
      (
        this.b[(i + this.length - 1) % this.length] +
        this.b[(i + 1) % this.length] +
        this.b[(i + this.length - this.width) % this.length] +
        this.b[(i + this.width) % this.length]
      ) * 0.2 + (
        this.b[(i + this.length - 1 - this.width) % this.length] +
        this.b[(i + this.length + 1 - this.width) % this.length] +
        this.b[(i + this.length - 1 + this.width) % this.length] +
        this.b[(i + 1 + this.width) % this.length]
      ) * 0.05 - this.b[i]
    )
  }

  react (next, da, db, feed, kill, delta) {
    for (let i = 0; i < this.length; ++i) {
      const A = this.a[i]
      const B = this.b[i]
      const reaction = A * B * B
      next.a[i] = A + (da * this._laplacienA(i) - reaction + feed * (1 - A)) * delta
      next.b[i] = B + (db * this._laplacienB(i) + reaction - (feed + kill) * B) * delta
    }
  }

  getA (x, y) {
    const i = (y * this.width + x) % this.length
    return this.a[ i < 0 ? i + this.length : i ]
  }

  getB (x, y) {
    const i = (y * this.width + x) % this.length
    return this.b[ i < 0 ? i + this.length : i ]
  }

  setA (x, y, value) {
    const i = (y * this.width + x) % this.length
    this.a[ i < 0 ? i + this.length : i ] = value
  }

  setB (x, y, value) {
    const i = (y * this.width + x) % this.length
    this.b[ i < 0 ? i + this.length : i ] = value
  }
}

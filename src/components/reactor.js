function laplacienA (grid, x, y) {
  return (
            grid.getA(x + 1, y) * 0.2 +
            grid.getA(x - 1, y) * 0.2 +
            grid.getA(x, y + 1) * 0.2 +
            grid.getA(x, y - 1) * 0.2 +
            grid.getA(x + 1, y + 1) * 0.05 +
            grid.getA(x + 1, y - 1) * 0.05 +
            grid.getA(x - 1, y + 1) * 0.05 +
            grid.getA(x - 1, y - 1) * 0.05 -
            grid.getA(x, y)
  )
  // return (
  //   (grid.getA(x + 1, y) + grid.getA(x - 1, y) - 2 * grid.getA(x, y)) +
  //   (grid.getA(x, y + 1) + grid.getA(x, y - 1) - 2 * grid.getA(x, y))
  // )
}

function laplacienB (grid, x, y) {
  return (
            grid.getB(x + 1, y) * 0.2 +
            grid.getB(x - 1, y) * 0.2 +
            grid.getB(x, y + 1) * 0.2 +
            grid.getB(x, y - 1) * 0.2 +
            grid.getB(x + 1, y + 1) * 0.05 +
            grid.getB(x + 1, y - 1) * 0.05 +
            grid.getB(x - 1, y + 1) * 0.05 +
            grid.getB(x - 1, y - 1) * 0.05 -
            grid.getB(x, y)
  )
  // return (
  //   (grid.getB(x + 1, y) + grid.getB(x - 1, y) - 2 * grid.getB(x, y)) +
  //   (grid.getB(x, y + 1) + grid.getB(x, y - 1) - 2 * grid.getB(x, y))
  // )
}

export default function reactor (da = 0, db = 0, feed = 0, kill = 0) {
  return function react (current, next, delta = 0) {
    for (let x = 0; x < current.width; ++x) {
      for (let y = 0; y < current.height; ++y) {
        const A = current.getA(x, y)
        const B = current.getB(x, y)
        const reaction = A * B * B
        next.setA(
          x,
          y,
          A + (
            da * current.laplacienA(x, y) - reaction + feed * (1 - A)
          ) * delta
        )
        next.setB(
          x,
          y,
          B + (
            db * current.laplacienB(x, y) + reaction - (feed + kill) * B
          ) * delta
        )
      }
    }
  }
}

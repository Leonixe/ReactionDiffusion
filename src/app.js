import Scene from './components/BasicScene'
import ReactionDiffusionGrid from './components/ReactionDiffusionGrid'
import reactor from './components/reactor'
import * as THREE from 'three'

let scene = new Scene(
   window.innerWidth,
   window.innerHeight
)

let lastUpdateDelta = 0


const deltaTime = 1000
// const canvas =  document.getElementById('canvas')
// const ctx = canvas.getContext('2d')

// const grids = {
//   current: new ReactionDiffusionGrid(canvas.width / 2, canvas.height / 2),
//   next: new ReactionDiffusionGrid(canvas.width / 2, canvas.height / 2)
// }

// const cx = grids.current.width / 2.0
// const cy = grids.current.height / 2.0

// for (let x = 0; x < grids.current.width; ++x) {
//   for (let y = 0; y < grids.current.height; ++y) {
//     grids.current.setB(x, y, 0)
//     grids.current.setA(x, y, 0.9)
//   }
// }

// for (let x = -100; x < 100; ++x) {
//   for (let y = -100; y < 100; ++y) {
//     if (Math.sqrt(x*x*0.5 + y*y) <= 3) {
//       grids.current.setB(x + cx, y + cy, 0.9999)
//     }
//   }
// }

// const AColor = new THREE.Color(1,1,1)
// const BColor = new THREE.Color(0,0,0)
// const cellColor = new THREE.Color(0,0,0)

// function swap (grids) {
//   const tmp = grids.current
//   grids.current = grids.next
//   grids.next = tmp
// }

function animate (delta) {
  //while (delta - lastUpdateDelta > deltaTime) {
  // for (let i = 0; i < 10; ++i) {
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.018, 0.051, 1.0)
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.025, 0.06, 1.0) // PULSATING MITOSIS

  //   // grids.current.react(grids.next, 1.0, 0.5, 0.026, 0.055, 1.0) // MAZE CHAOS

  //   // grids.current.react(grids.next, 1.0, 0.5, 0.03, 0.0565, 1.0) // RESONANCE
  //   grids.current.react(grids.next, 1.0, 0.5, 0.034, 0.0618, 1.0) // SPOTS
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.037, 0.06, 1.0) // SPIDER
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.046, 0.0594, 1.0)  // WATER
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.0367, 0.0649, 1.0) // MITOSIS
  //   // grids.current.react(grids.next, 1.0, 0.5, 0.0545, 0.062, 1.0)  // MAZE
  //   swap(grids)
  // }

  // let max = Number.NEGATIVE_INFINITY

  // for (let x = 0; x < grids.current.width; ++x) {
  //   for (let y = 0; y < grids.current.height; ++y) {
  //     const total = grids.current.getA(x, y) + grids.current.getB(x, y)

  //     ctx.fillStyle = cellColor.set(0, 0, 0)
  //                              .lerp(AColor, grids.current.getA(x, y) / total)
  //                              .lerp(BColor, grids.current.getB(x, y) / total)
  //                              .getStyle()
  //     ctx.fillRect(x , y , 4, 4)
  //   }
  // }

  scene.render(delta)

  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

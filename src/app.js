import Scene from './components/BasicScene'
import ReactionDiffusionGrid from './components/ReactionDiffusionGrid'
import reactor from './components/reactor'
import * as THREE from 'three'
import Vivus from 'vivus'
import {TweenLite, TweenMax} from 'gsap'
import rangesliderJs from 'rangeslider-js'

let scene = new Scene(
   window.innerWidth,
   window.innerHeight
)
let feed = 0
var sliderEl = document.getElementById('slider1');
rangesliderJs.create(sliderEl, {
  onSlide: feed => scene.cube.updateFeed(feed)
  
})


const Konami_Code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let Konami_done = 0;

window.addEventListener('keydown', (e) => { onKeyDown(e) }, false);
var audio = new Audio('./assets/waow.mp3');

function onKeyDown(e) {
  if (e.keyCode === Konami_Code[Konami_done]) {
    Konami_done += 1

    if (Konami_done === Konami_Code.length) {
      
      audio.play();

      Konami_done = 0;

      return false;
    }
  } else {
    Konami_done = 0;
  }

  return false
}

let kill = 0
var sliderEl = document.getElementById('slider2');
rangesliderJs.create(sliderEl, {
  onSlide: kill => scene.cube.updateKill(kill)

})

document.getElementById('button2').addEventListener('click', () => {
  scene.cube.restartCenter()
})


new Vivus('logo_SVG', { duration: 100, type: 'sync' }, function () {
  TweenLite.delayedCall(1, function() {
    TweenLite.to('#logo', 2, {opacity: 0, onComplete: function () {
      TweenLite.to('#logo', 0, { width: '4vw', height: '4vw', top: '3vw' })
      TweenLite.to('#logo svg', 0, { width: '4vw', height: '4vw', top: '3vw' })
      TweenLite.to('#logo', 1, { opacity: "1", bottom: 'inherit', ease: Expo.easeOut, onComplete: function () {
        TweenMax.staggerTo('#text_en div span', 3, {opacity: 1, transform: 'translateY(0)', ease: Back.easeOut.config(1.7), onComplete: function () {
                TweenLite.to('#author', 1, { opacity: "1" });
                TweenLite.to('#text_fr', 1, { opacity: "0.6" });
                TweenLite.to('#button_container', 1, { opacity: "1", display:'flex', onComplete: function(){
                  TweenLite.to('#button_container svg', 1, { opacity: "1" });
                  new Vivus('button_svg', { duration: 75, type: 'sync' });
                  TweenLite.to('#button_text', 0.5, { opacity: "1" });
                } });
              }
            }, 0.5);
          }
        });
      }
    });
  })
});

let cameraProperties = { zoom: 400 };

document.getElementById('button_container').addEventListener('click', function(){
  document.getElementById('audioPlayer').play()
  TweenLite.to('#content', 1, { opacity: "0", display: 'none' });
  TweenLite.to(cameraProperties, 3.5, { zoom: "-=350", ease: Power2.easeOut });
  TweenLite.to('#ui_Button', 1, { opacity: "1", display: 'flex' });
  TweenLite.to('.slidecontainer', 1, { opacity: "1", display: 'inherit' });
  new Vivus('button2_svg', { duration: 75, type: 'sync' });
  TweenMax.staggerTo('#text_xp_container div span', 3, { opacity: "1", transform: 'translateY(0vw)', ease: Back.easeOut.config(1.7) }, 0.5);
  scene.activateOrbitControl()
})

let lastUpdateDelta = 0

const deltaTime = 1000
console.love = console.log.bind(console, '❤️');
console.cheers = console.log.bind(console, '🍺');


// Log to the console!
console.clear();
console.love('Made with love and chocolate !')
console.cheers('Thx to Dorian Lods and Fatma Laadhari')

function animate (delta) {
  scene.render(delta);
  if (cameraProperties.zoom > 50) {
    scene.camera.position.z = cameraProperties.zoom
  }
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

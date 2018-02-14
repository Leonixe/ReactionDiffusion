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
var sliderEl = document.getElementById('slider1');
rangesliderJs.create(sliderEl)


new Vivus('logo_SVG', { duration: 100, type: 'sync' }, function () {
  TweenLite.delayedCall(1, function() {
    TweenLite.to('#logo', 3, {opacity: 0, onComplete: function () {
        TweenLite.to('#logo', 0, { width: '4vw', height: '4vw', top: '3vw' })
        TweenLite.to('#logo', 1, { opacity: "1", bottom: 'inherit', ease: Expo.easeOut, onComplete: function () {
            TweenMax.staggerTo('#text_en div span', 2, {opacity: 1, 'margin-top': '0vw', ease: Expo.easeOut, onComplete: function () {
                TweenLite.to('#author', 1, { opacity: "1" });
                TweenLite.to('#text_fr', 1, { opacity: "0.6" });
                TweenLite.to('#button_container', 1, { opacity: "1", onComplete: function(){
                  TweenLite.to('#button_container svg', 1, { opacity: "1" });
                  new Vivus('button_svg', { duration: 100, type: 'sync' });
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
  TweenLite.to('#content', 1, { opacity: "0", display: 'none' });
  TweenLite.to(cameraProperties, 3.5, { zoom: "-=350", ease: Power2.easeOut });
})

let lastUpdateDelta = 0

const deltaTime = 1000


function animate (delta) {
  scene.render(delta);
  if (cameraProperties.zoom > 50) {
    scene.camera.position.z = cameraProperties.zoom
  }
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

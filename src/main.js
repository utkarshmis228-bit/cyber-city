
import './style.css'
import * as THREE from 'three'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050816)
scene.fog = new THREE.Fog(0x050816, 55, 220)

const camera = new THREE.PerspectiveCamera(
  70, window.innerWidth / window.innerHeight, 0.1, 300
)
camera.position.set(0, 5, 12)


const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.00

document.body.appendChild(renderer.domElement)

const composer = new EffectComposer(renderer)

composer.addPass(new RenderPass(scene, camera))

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.45, // Glow strength
  0.25,  // Glow radius
  0.65  // Brightness threshold
)

composer.addPass(bloomPass)
composer.addPass(new OutputPass())
// CYBER CITY - Custom audio files
const bgMusic = new Audio('/cyber-city/bg-music.mp3')
bgMusic.loop = true
bgMusic.volume = 0.35

const ringAudio = new Audio('/cyber-city/ring.mp3')
const crashAudio = new Audio('/cyber-city/crash.mp3')
const gameOverAudio = new Audio('/cyber-city/gameover.mp3')

function playAudio(audio) {
  audio.currentTime = 0
  audio.play().catch(error => {
    console.log('Audio playback blocked:', error)
  })
}

function startBackgroundMusic() {
  if (bgMusic.paused) {
    bgMusic.play().catch(error => {
      console.log('Background music needs user interaction.')
    })
  }
}

function playRingSound() {
  playAudio(ringAudio)
}

function playCrashSound() {
  playAudio(crashAudio)
}

function playGameOverSound() {
  playAudio(gameOverAudio)
}
const gameOverScreen = document.createElement('div')
gameOverScreen.id = 'game-over'
gameOverScreen.innerHTML = `
  <h1>GAME OVER</h1>
  <img src="./utkarshh.jpg" alt="Utkarsh">
  <p>You crashed into an obstacle!</p>
  <button id="restart-btn">PLAY AGAIN</button>
`
document.body.appendChild(gameOverScreen)

const citySafeScreen = document.createElement('div')
citySafeScreen.id = 'city-safe'
citySafeScreen.innerHTML = `
  <h1>🌆 CITY RESTORED!</h1>
  <img src="./utkarsh.jpg" alt="Utkarsh" class="winner-photo">
  <p>MISSION COMPLETE</p>
  <p>All 8 energy rings collected.</p>
  <button id="city-restart-btn">PLAY AGAIN</button>
`
document.body.appendChild(citySafeScreen)

document.getElementById('city-restart-btn').addEventListener('click', () => {
  location.reload()
})

document.getElementById('restart-btn').addEventListener('click', () => {
  player.position.set(0, 0, 5)
  obstacles.forEach((obstacle, i) => {
    obstacle.visible = true
    obstacle.position.set(
      (Math.random() - 0.5) * 7,
      0.75,
      -15 - i * 18
    )
  })
  rings.forEach(ring => ring.visible = true)
  score = 0
  gameover = false
  document.getElementById('score').textContent = 'ENERGY: 0 / 8'
  gameOverScreen.style.display = 'none'
})

scene.add(new THREE.HemisphereLight(0x8ab4ff, 0x17102e, 2))


const glow = new THREE.PointLight(0x00eaff, 45, 55)
glow.position.set(0, 8, 0)
scene.add(glow)

// Magenta city lighting
const pinkGlow = new THREE.PointLight(0xff28d7, 25, 40)
pinkGlow.position.set(0, 5, -20)
scene.add(pinkGlow)

// Cool blue ambient fill
const blueGlow = new THREE.PointLight(0x365bff, 18, 50)
blueGlow.position.set(0, 7, -45)
scene.add(blueGlow)


const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x101326, roughness: 0.85 })
)
ground.rotation.x = -Math.PI / 2
ground.position.y = -0.1
scene.add(ground)

// Neon road
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 180),
  new THREE.MeshStandardMaterial({ color: 0x090c19, roughness: 0.7 })
)
road.rotation.x = -Math.PI / 2
road.position.set(0, 0, -65)
scene.add(road)

 // Neon road lighting strips
const neonRoadMaterial = new THREE.MeshBasicMaterial({
  color: 0x00eaff
})

const pinkRoadMaterial = new THREE.MeshBasicMaterial({
  color: 0xff28d7
})

// Bright strips along the road
for (const x of [-5.5, 5.5]) {
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.035, 180),
    neonRoadMaterial
  )
  strip.position.set(x, 0.025, -65)
  scene.add(strip)
}

// Pink accent strips
for (const x of [-3.8, 3.8]) {
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.025, 180),
    pinkRoadMaterial
  )
  strip.position.set(x, 0.02, -65)
  scene.add(strip)
}

// Glowing cyan lane markers
for (let z = -145; z < 20; z += 8) {
  const marker = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.025, 3),
    neonRoadMaterial
  )
  marker.position.set(0, 0.025, z)
  scene.add(marker)
}

const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x00eaff })
for (const x of [-5.8, 5.8]) {
  const line = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 180), lineMaterial)
  line.position.set(x, 0.03, -65)
  scene.add(line)
}

// Futuristic city buildings
const buildingMaterials = [
  0x152448, 0x21183e, 0x102c3b, 0x24213d
].map(color => new THREE.MeshStandardMaterial({
  color, metalness: 0.55, roughness: 0.35
}))

for (let z = -130; z < 25; z += 9) {
  for (const side of [-1, 1]) {
    const width = 3 + Math.random() * 5
    const height = 7 + Math.random() * 25
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 6 + Math.random() * 4),
      buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)]
    )
    building.position.set(side * (10 + Math.random() * 12), height / 2, z)
    scene.add(building)

    const neon = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.8, 0.08, 0.08),
      new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00eaff : 0xff28d7
      })
    )
    neon.position.set(building.position.x, height * 0.7, z - 3.05)
    scene.add(neon)

    // Glowing window strips
    for (let y = 2; y < height - 1; y += 3) {
      const windows = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.65, 0.12, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x4b9dff })
      )
      windows.position.set(building.position.x, y, z - 3.06)
      scene.add(windows)
    }
  }
}


 // BRIGHT CYBERPUNK CITY
const cyberColors = [0x00eaff, 0xff25d9, 0x8b5cff];

for (let z = 8; z >= -100; z -= 13) {
  for (const side of [-1, 1]) {
    const w = 4 + Math.random() * 2;
    const d = 4 + Math.random() * 3;
    const h = 18 + Math.random() * 24;
    const x = side * (9 + Math.random() * 5);

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: 0x182442,
        emissive: 0x111d42,
        emissiveIntensity: 0.8,
        metalness: 0.45,
        roughness: 0.55
      })
    );

    building.position.set(x, h / 2, z);
    scene.add(building);

    // Glowing vertical edges
    const neon = cyberColors[
      Math.floor(Math.random() * cyberColors.length)
    ];

    for (const edge of [-1, 1]) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, h, 0.12),
        new THREE.MeshBasicMaterial({ color: neon })
      );

      strip.position.set(
        x + edge * w / 2,
        h / 2,
        z + d / 2 + 0.08
      );
      scene.add(strip);
    }

    // Bright windows facing the camera
    for (let wy = 2; wy < h - 2; wy += 2.5) {
      for (let wx = -w / 2 + 0.65; wx < w / 2; wx += 1.05) {
        if (Math.random() > 0.35) continue;

        const windowLight = new THREE.Mesh(
          new THREE.BoxGeometry(0.48, 0.85, 0.07),
          new THREE.MeshBasicMaterial({
            color: cyberColors[
              Math.floor(Math.random() * cyberColors.length)
            ]
          })
        );

        windowLight.position.set(
          x + wx,
          wy,
          z + d / 2 + 0.12
        );
        scene.add(windowLight);
      }
    }

    // Glowing rooftop
    const roofLight = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.3, 0.18, d + 0.3),
      new THREE.MeshBasicMaterial({ color: neon })
    );

    roofLight.position.set(x, h + 0.1, z);
    scene.add(roofLight);
  }
}


// Player
const player = new THREE.Group()
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.4, 0.55),
  new THREE.MeshStandardMaterial({
    color: 0x00d9ff, emissive: 0x004b77, metalness: 0.6
  })
)
body.position.y = 1
player.add(body)

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xff28d7, emissive: 0x4b0037 })
)
head.position.y = 2
player.add(head)
player.position.set(0, 0, 5)
scene.add(player)
const obstacles =[]
for (let i = 0; i < 5; i++) {
  const obstacle = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1),
    new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0x660000
    })
  )

  obstacle.position.set(
    (Math.random() - 0.5) * 7,
    0.75,
    -15 - i * 18
  )

  scene.add(obstacle)
  obstacles.push(obstacle)
}
// Collectible neon rings
const rings = []
for (let i = 0; i < 8; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.12, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xff28d7 })
  )
  ring.position.set((Math.random() - 0.5) * 5, 1.8, -8 - i * 13)
  scene.add(ring)
  rings.push(ring)
}

const keys = {}
let score = 0
let gameover = false
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true
  startBackgroundMusic()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
    e.preventDefault()
  }
})
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false)
// Mobile circular joystick
const joystick = document.createElement('div')
joystick.id = 'joystick'
joystick.innerHTML = '<div id="joystick-knob"></div>'
document.body.appendChild(joystick)

const knob = document.getElementById('joystick-knob')
const directions = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright']
let joystickPointer = null

function moveJoystick(e) {
  const rect = joystick.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  let dx = e.clientX - cx
  let dy = e.clientY - cy

  const max = 38
  const distance = Math.hypot(dx, dy)
  if (distance > max) {
    dx = dx / distance * max
    dy = dy / distance * max
  }

  knob.style.transform = `translate(${dx}px, ${dy}px)`

  directions.forEach(key => keys[key] = false)

  if (Math.abs(dx) > 9)
    keys[dx < 0 ? 'arrowleft' : 'arrowright'] = true
  if (Math.abs(dy) > 9)
    keys[dy < 0 ? 'arrowup' : 'arrowdown'] = true
}

function resetJoystick() {
  joystickPointer = null
  directions.forEach(key => keys[key] = false)
  knob.style.transform = 'translate(0px, 0px)'
}

joystick.addEventListener('pointerdown', e => {
  e.preventDefault()
  joystickPointer = e.pointerId
  joystick.setPointerCapture(e.pointerId)
  moveJoystick(e)
})

joystick.addEventListener('pointermove', e => {
  if (e.pointerId === joystickPointer) moveJoystick(e)
})

joystick.addEventListener('pointerup', resetJoystick)
joystick.addEventListener('pointercancel', resetJoystick)
const hud = document.createElement('div')
hud.id = 'hud'
hud.innerHTML = '<b>CYBER CITY</b><span>NEON RUNNER</span><p>WASD / ARROWS — MOVE</p><p id="score">ENERGY: 0 / 8</p>'
document.body.appendChild(hud)

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  const speed = 10 * dt

if (!gameover) {
  obstacles.forEach(obstacle => {
    if (!obstacle.visible) return

    const playerBox = new THREE.Box3().setFromObject(player)
    const obstacleBox = new THREE.Box3().setFromObject(obstacle)

    if (playerBox.intersectsBox(obstacleBox)) {
      gameover = true
      gameOverScreen.style.display = 'flex'
    }
  })
}

if (gameover) {
  composer.render()
  return
}

  // Move obstacles towards the player
  obstacles.forEach(obstacle => {
    if (!obstacle.visible) return

    obstacle.position.z += 12 * dt

    // Send obstacle back when it passes the player
    if (obstacle.position.z > player.position.z + 8) {
      obstacle.position.z =
        Math.min(...obstacles.map(o => o.position.z)) - 18

      obstacle.position.x = (Math.random() - 0.5) * 7
    }
  })

  if (keys['a'] || keys['arrowleft']) player.position.x -= speed
  if (keys['d'] || keys['arrowright']) player.position.x += speed
  if (keys['w'] || keys['arrowup']) player.position.z -= speed
  if (keys['s'] || keys['arrowdown']) player.position.z += speed

  player.position.x = THREE.MathUtils.clamp(player.position.x, -4.5, 4.5)
  player.position.z = THREE.MathUtils.clamp(player.position.z, -120, 8)

  camera.position.lerp(
    new THREE.Vector3(player.position.x * 0.4, 5, player.position.z + 9),
    0.08
  )
  camera.lookAt(player.position.x, 1, player.position.z - 5)
  rings.forEach((ring, i) => {
    ring.rotation.z += dt
    ring.rotation.y += dt * 1.5
    if (ring.visible && player.position.distanceTo(ring.position) < 3.0) {
      ring.visible = false
      playRingSound()
      score++
      document.getElementById('score').textContent = `ENERGY: ${score} / 8`
      
if (score === 8) {
  document.getElementById('score').textContent = 'CITY RESTORED! 🎉'
  playCrashSound()
  gameover = true
  playVictorySound()
  citySafeScreen.style.display = 'flex'
}

    }
  })

 composer.render()
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setsize(window.innerwidth,window.innerHeight)
}) 


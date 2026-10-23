
import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050816)
scene.fog = new THREE.Fog(0x050816, 35, 150)

const camera = new THREE.PerspectiveCamera(
  70, window.innerWidth / window.innerHeight, 0.1, 300
)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

scene.add(new THREE.HemisphereLight(0x8ab4ff, 0x17102e, 2))

const glow = new THREE.PointLight(0x00eaff, 30, 45)
glow.position.set(0, 8, 0)
scene.add(glow)

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

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
    e.preventDefault()
  }
})
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false)

const hud = document.createElement('div')
hud.id = 'hud'
hud.innerHTML = '<b>CYBER CITY</b><span>NEON RUNNER</span><p>WASD / ARROWS — MOVE</p><p id="score">ENERGY: 0 / 8</p>'
document.body.appendChild(hud)

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  const speed = 10 * dt

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
      score++
      document.getElementById('score').textContent = `ENERGY: ${score} / 8`
      if (score === 8) document.getElementById('score').textContent = 'CITY RESTORED! 🎉'
    }
  })

  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}) 


// Config
const pixelTimer = 5e3 * 60

// Setup
const canvas = document.querySelector('canvas')
const frame = document.querySelector('.frame')
const paintMenu = document.querySelector('.paint-menu')
const closeBtn = document.querySelector('.close')
const paintBtn = document.querySelector('.brush')
const timerNumber = document.querySelector('.timer .number')

canvas.width = 100
canvas.height = canvas.width
const ctx = canvas.getContext('2d', { willReadFrequently: true })

let cellSize = canvas.getBoundingClientRect().width / canvas.width
frame.style.width = `${cellSize}px`

let [scale, translateX, translateY] = [1, 0, 0]
let selected = { x: 0, y: 0 }

let selectedColorElement

// Setup Paint-Menu
for (let color of paintMenu.querySelectorAll('.color')) {
  color.style.backgroundColor = color.getAttribute('value')
}

// Canvas
function draw(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

function updateTransform() {
  scale = Math.min(Math.max(scale, 0.3), 6)
  translateX = Math.min(Math.max(translateX, -window.innerWidth / 2), window.innerWidth / 2)
  translateY = Math.min(Math.max(translateY, -window.innerHeight / 2), window.innerHeight / 2)

  canvas.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
  
  cellSize = canvas.getBoundingClientRect().width / canvas.width
  frame.style.width = `${cellSize}px`
  setFramePos(selected.x, selected.y)
}

// Color
document.onclick = e => {
  if (!e.target.classList.contains('color')) return

  if (selectedColorElement) selectedColorElement.removeAttribute('selected')
  selectedColorElement = e.target
  e.target.setAttribute('selected', '')
}
closeBtn.onclick = e => { paintMenu.style.bottom = '-200px' }
  // Update timer
setInterval(e => {
  let remainingTime = localStorage.getItem('nextPixel') ? Math.max(localStorage.getItem('nextPixel') - Date.now(), 0) : 0
  remainingTime /= 1000

  remainingMin = Math.trunc(remainingTime / 60)
  remainingSec = Math.trunc(remainingTime % 60)

  timerNumber.innerText = `${remainingMin.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`
}, 1e3)

// Zoom
document.addEventListener('wheel', e => {
  scale += 0.1 * (e.deltaY > 0 ? -1 : 1) * scale
  
  updateTransform()
})

// Pan
document.addEventListener('mousedown', (e) => {
  window.onmousemove = e => {
    translateX = (e.clientX - startX) 
    translateY = (e.clientY - startY) 
    
    updateTransform()
  }

  startX = e.clientX - translateX
  startY = e.clientY - translateY
})
window.addEventListener('mouseup', e => window.onmousemove = undefined)

// Select
function setFramePos(x, y) {
  frame.style.left = `${canvas.getBoundingClientRect().left + cellSize * x}px`
  frame.style.top = `${canvas.getBoundingClientRect().top + cellSize * y}px`
  frame.style.display = 'block'
}
  // Update
frame.addEventListener('dblclick', e => canvas.dispatchEvent(new Event('dblclick')))
canvas.addEventListener('dblclick', e => {
  rect = canvas.getBoundingClientRect()
  mouse = {
    x: e.clientX,
    y: e.clientY
  }

  inX = mouse.x - rect.x
  inY = mouse.y - rect.y

  selected.x = Math.trunc(inX / cellSize)
  selected.y = Math.trunc(inY / cellSize)

  setFramePos(selected.x, selected.y)
  paintMenu.style.bottom = '0'
})

// Paint
paintBtn.onclick = e => {
  if (!selectedColorElement || !selected.x || localStorage.getItem('nextPixel') && localStorage.getItem('nextPixel') - Date.now() > 0) {
    paintBtn.style.animation = 'shake 1 200ms linear'
    paintBtn.addEventListener('animationend', e => { paintBtn.style.animation = 'none' })
    return 
  }

  draw(selected.x, selected.y, selectedColorElement.getAttribute('value'))
  // Here I have to do an API Post

  localStorage.setItem('nextPixel', Date.now() + pixelTimer)
}

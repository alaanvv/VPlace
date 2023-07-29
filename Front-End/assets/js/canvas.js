class Canvas {
  static dom = document.querySelector('canvas')
  static ctx = Canvas.dom.getContext('2d')

  static pixelSize = Canvas.dom.getBoundingClientRect().width / Canvas.dom.width
  static scale = 1
  static translateX = 0
  static translateY = 0

  static selected = { x: 0, y: 0 }

  static draw(x = Canvas.selected.x, y = Canvas.selected.y, color = undefined) {
    if (!color) color = `#${PaintMenu.color}`

    Canvas.ctx.fillStyle = color
    Canvas.ctx.fillRect(x, y, 1, 1)
  }

  static updateTransform() {
    Canvas.scale = Math.min(Math.max(Canvas.scale, 0.3), 6)
    Canvas.translateX = Math.min(Math.max(Canvas.translateX, -window.innerWidth / 2), window.innerWidth / 2)
    Canvas.translateY = Math.min(Math.max(Canvas.translateY, -window.innerHeight / 2), window.innerHeight / 2)

    Canvas.dom.style.transform = `scale(${Canvas.scale}) translate(${Canvas.translateX}px, ${Canvas.translateY}px)`

    Canvas.updatePixelSize()
    Frame.updatePos()
  }

  static updatePixelSize() {
    Canvas.pixelSize = Canvas.dom.getBoundingClientRect().width / Canvas.dom.width
  }
}

// Zoom
document.addEventListener('wheel', e => {
  Canvas.scale += 0.1 * (e.deltaY > 0 ? -1 : 1) * Canvas.scale

  Canvas.updateTransform()
})

// Pan
document.addEventListener('mousedown', e => {
  const startX = e.clientX - Canvas.translateX
  const startY = e.clientY - Canvas.translateY

  window.onmousemove = e => {
    Canvas.translateX = (e.clientX - startX)
    Canvas.translateY = (e.clientY - startY)

    Canvas.updateTransform()
  }
})
window.addEventListener('mouseup', e => window.onmousemove = undefined)

// Select a pixel
Canvas.dom.addEventListener('dblclick', e => {
  var rect = Canvas.dom.getBoundingClientRect()
  var mouse = { x: e.clientX, y: e.clientY }
  var inPos = { x: mouse.x - rect.x, y: inY = mouse.y - rect.y }

  Canvas.selected.x = Math.trunc(inPos.x / Canvas.pixelSize)
  Canvas.selected.y = Math.trunc(inPos.y / Canvas.pixelSize)

  if (isNaN(Canvas.selected.x)) {
    console.log(inPos)
    console.log(mouse.x)
    console.log(rect.x)
    console.log(mouse.y)
    console.log(rect.y)
  }

  Frame.updatePos()
  PaintMenu.show()
})
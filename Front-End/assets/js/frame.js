class Frame {
  static dom = document.querySelector('.frame')

  static updatePos() {
    Frame.dom.style.width = `${Canvas.pixelSize}px`
    Frame.dom.style.left = `${Canvas.dom.getBoundingClientRect().left + Canvas.pixelSize * Canvas.selected.x}px`
    Frame.dom.style.top = `${Canvas.dom.getBoundingClientRect().top + Canvas.pixelSize * Canvas.selected.y}px`
    Frame.dom.style.display = 'block'
  }
}

window.addEventListener('canvasmoved', Frame.updatePos)
Frame.dom.addEventListener('dblclick', e => Canvas.dom.dispatchEvent(new Event('dblclick')))

Frame.updatePos()
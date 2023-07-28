class PaintMenu {
  static dom = document.querySelector('.paint-menu')
  static paintBtn = document.querySelector('.brush')

  static colorElement = undefined

  static hide = () => PaintMenu.dom.classList.add('hidden')
  static show = () => PaintMenu.dom.classList.remove('hidden')

  static updateTimer = () => {
    var remainingTime = localStorage.getItem('nextPixel') ? Math.max(localStorage.getItem('nextPixel') - Date.now(), 0) : 0
    remainingTime /= 1000 // Convert ms to s
  
    var remainingMin = Math.trunc(remainingTime / 60).toString().padStart(2, '0')
    var remainingSec = Math.trunc(remainingTime % 60).toString().padStart(2, '0')
  
    document.querySelector('.timer .number').innerText = `${remainingMin}:${remainingSec}`
  }
}

PaintMenu.paintBtn.addEventListener('animationend', e => { PaintMenu.paintBtn.style.animation = 'none' })
document.querySelector('.close').onclick = e => { PaintMenu.hide() }

document.onclick = e => {
  // Only respond for '.color'
  if (!e.target.classList.contains('color')) return

  // Unselect the current selected
  if (PaintMenu.colorElement) PaintMenu.colorElement.removeAttribute('selected')

  PaintMenu.colorElement = e.target
  e.target.setAttribute('selected', '')
}

PaintMenu.paintBtn.addEventListener('click', e => {
  if (!PaintMenu.colorElement || Canvas.selected.x === undefined || localStorage.getItem('nextPixel') && localStorage.getItem('nextPixel') > Date.now()) return PaintMenu.paintBtn.style.animation = 'shake 1 200ms linear'

  window.dispatchEvent(new Event('paint'))
})

setInterval(PaintMenu.updateTimer, 1e3)
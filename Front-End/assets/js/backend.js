const apiUrl = 'http://localhost:666/'

let logged = false
const user = {} // { id, guilds, nextPixel }
const config = {} // { colors, size, timer }

class Backend {
  static _fetch(endpoint, method, body = undefined) {
    const options = { method: method, headers: new Headers({ 'content-type': 'application/json' }) }
    if (body) options.body = JSON.stringify(body)

    return fetch(`${apiUrl}${endpoint}`, options)
      .then(res => res.text())
      .then(json => JSON.parse(json))
  }

  static async setup() {
    const res = Backend.loadUser()
    // Info is required before pixels
    await Backend.loadInfo()
    Backend.loadPixels()
  }

  static async loadUser() {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const [token, tokenType] = [fragment.get('access_token'), fragment.get('token_type')]

    logged = Boolean(token)
    if (!logged) {
      alert('You\'re not allowed to paint here')

      PaintMenu.dom.remove()
      Frame.dom.remove()
    }

    const userInfo = await fetch('https://discord.com/api/users/@me', { headers: { authorization: `${tokenType} ${token}` } })
      .then(result => result.json())
    user.id = userInfo.id

    const userGuilds = await fetch('https://discord.com/api/users/@me/guilds', { headers: { authorization: `${tokenType} ${token}` } })
      .then(result => result.json())
    user.guilds = userGuilds.map(guild => guild.id)
  }

  static async loadInfo() {
    const infoRes = await Backend._fetch('info', 'GET')
    // Add colors to menu and resize canvas
    config.colors = infoRes.colors
    config.size = infoRes.size
    config.timer = infoRes.timer

    Canvas.dom.width = config.size
    Canvas.dom.height = Canvas.dom.width

    for (let color of config.colors) {
      let div = document.createElement('div')
      div.classList.add('color')
      div.setAttribute('value', `#${color}`)
      div.style.backgroundColor = `#${color}`

      PaintMenu.dom.prepend(div)
    }
  }

  static loadPixels() {
    Backend._fetch('canvas', 'GET')
      .then(pixels => {
        for (let pixel of pixels) {
          Canvas.draw(pixel.x, pixel.y, `#${pixel.color}`)
        }
      })
  }

  static sendPixelToDatabase() {
    if (!logged) return

    user.nextPixel = Date.now() + config.timer
    var pixel = { x: Canvas.selected.x, y: Canvas.selected.y, color: PaintMenu.color }
    var data = { user, pixel }

    Backend._fetch('paint', 'POST', data)
      .then(res => { if (res == 0) alert('Not allowed by Backend') })
  }
}

Backend.setup()
setInterval(Backend.loadPixels, 30e3)
const mysql = require('mysql')

class Database {
  constructor(host, port, user, database, password) {
    this.conn = mysql.createConnection({ host, port, user, database, password })

    this.conn.query('CREATE TABLE IF NOT EXISTS pixels (x SMALLINT, y SMALLINT, color CHAR(6));')
    this.conn.query('CREATE TABLE IF NOT EXISTS timers (id BIGINT, nextPixel BIGINT);')
  }

  add_timer(id, nextPixel) {
    this.conn.query('DELETE FROM timers WHERE id = ?;', [id])
    this.conn.query('INSERT INTO timers (id, nextPixel) VALUES (?, ?);', [id, nextPixel])
  }

  get_timer(id) {
    return new Promise(resolve => {
      this.conn.query('SELECT nextPixel FROM timers WHERE id = ?;', [id], (err, res) => { 
        resolve(res && res[0] ? res[0].nextPixel : 0) 
      })
    })
  }

  get_canvas() {
    return new Promise(resolve => {
      this.conn.query('SELECT * FROM pixels;', (err, res) => { resolve(res) })
    })
  }

  create_pixel(pixel) {
    this.conn.query('DELETE FROM pixels WHERE x = ? AND y = ?;', [pixel.x, pixel.y])
    this.conn.query('INSERT INTO pixels (x, y, color) VALUES (?, ?, ?);', [pixel.x, pixel.y, pixel.color])
  }
}

module.exports = Database

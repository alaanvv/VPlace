const Router = require('express').Router
const Database = require('./database.js')
require('dotenv').config()

const guild = process.env.guild
const size = Number(process.env.size)
const timer = Number(process.env.timer)
const colors = JSON.parse(process.env.colors)

const router = new Router()
const db = new Database(process.env.db_host, Number(process.env.db_port), process.env.db_user, process.env.db_name, process.env.db_password)

router.get('/info', (req, res) => res.send({ colors: colors, size: size, timer: timer }))

router.get('/canvas', async (req, res) => res.send(await db.get_canvas() || []))

router.post('/paint', async (req, res) => {
  const data = req.body
  const user = data.user
  const pixel = data.pixel

  // Accepts only my server members
  // Check if user is timed out
  const timer = await db.get_timer(user.id)
  if (!colors.includes(pixel.color) return res.send('Invalid color')
  if (!user.guilds.includes(guild)) return res.send('Invalid guild')
  if (timer && timer > Date.now())) return res.send('Invalid time')
  db.create_pixel(pixel)
  db.add_timer(user.id, user.nextPixel)

  res.send('1')
})

module.exports = router

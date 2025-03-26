const express = require('express')
const router = require('./router')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = Number(process.env.port)

app.use(express.json())
app.use(cors())
app.use(router)
app.use(express.static(`${__dirname}/public`))

app.listen(port)

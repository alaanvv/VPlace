const express = require('express')
const cors = require('cors')
const router = require('./router')
require('dotenv').config()

const app = express()
const port = Number(process.env.port)

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(port)
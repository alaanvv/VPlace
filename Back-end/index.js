const express = require('express')
const cors = require('cors')
const router = require('./router')

const app = express()
const port = 666

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(port, () => console.log(`Running on http://localhost:${port}`))
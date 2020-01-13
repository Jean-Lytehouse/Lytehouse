const express = require('express')
const upload = require('./upload')
const upload = require('./download')

const cors = require('cors')

const server = express()

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

server.use(cors(corsOptions))

server.post('/upload', upload)

server.get('/download', download)

server.listen(3000, () => {
  console.log('Server started!')
})
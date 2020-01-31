console.log(new Date().toLocaleString(),'pauk defects register start')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config =  require('./config/config')

const app = express()


app.use(bodyParser.json())
app.use(cors())


require('./routes')(app)

app.listen(config.port)
console.log(new Date().toLocaleString(),`Server started on port ${config.port}`, '')
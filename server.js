const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');

require('dotenv').config({ path: __dirname + '/.env' })

const connectToDB = require('./infra/db')
const attachWebSockets = require('./infra/websockets')

const userRoutes = require('./routes/users');
const meetRoutes = require('./routes/meets');
const messageRoutes = require('./routes/messages');

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/users', userRoutes);
app.use('/api/meets', meetRoutes);
app.use('/api/messages', messageRoutes);

app.use(cors())

const main = async() => {
    await connectToDB()
    const server = await attachWebSockets(app)
    return server
}

main().then(server => {
    server.listen(3001, () => {
        console.log("listening on 3001")
    })
})
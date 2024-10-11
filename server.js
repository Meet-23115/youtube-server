import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const server = express()

server.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential:true
}))
server.use(cookieParser())
server.use(express.json())

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))

// import routers
import userRouter from './src/routes/user.route.js'

//declare route
server.use('/api/v1/user', userRouter)

export default server;
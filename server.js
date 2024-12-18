import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const server = express()

server.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))

// server.options('*', cors());
server.use(cookieParser())
server.use(express.json())

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static("public"))


// import routers
import userRouter from './src/routes/user.route.js'
import dataRouter from './src/routes/data.route.js'

//declare route


server.use('/api/v1/user', userRouter)
server.use('/api/v1/data', dataRouter )


export default server;
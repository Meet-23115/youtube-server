import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const server = express()

server.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential:true
}))
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extented:true}))
server.use(express.static("public"))

export default server;
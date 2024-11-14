import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const server = express()

server.use(cors({
    origin: "https://youtube-rust-beta.vercel.app", // Replace with your Vercel frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials if needed (e.g., for cookies or tokens)
  }));

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
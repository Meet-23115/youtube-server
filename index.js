import server from './server.js';
import connectDb from './src/db/mongo.js';
import dotenv from 'dotenv';


dotenv.config();

connectDb()
.then(()=>{
    const port = process.env.PORT || 8080
    server.listen(port, ()=>console.log(`server is listeing at port ${port}`))
})
.catch((err)=>{
    console.log('MONGODB connection failed !!! ', err)
})

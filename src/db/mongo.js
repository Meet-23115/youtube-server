import mongoose from "mongoose"
import { DB_NAME } from "../../constansts.js"

// require('dotenv').config();


// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db('Project-1');

const connectDb = async()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MONGODB CONNECTION FAILED: ', error)   
        process.exit(1)
    }
}



export default connectDb
// module.exports = client; 

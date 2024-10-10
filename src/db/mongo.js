const { MongoClient } = require("mongodb");
require('dotenv').config();


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('Project-1');


// async function run() {
//     try {
//         await client.connect();
//         // const db = client.db('Project-1'); // Replace with your database name

//         // // Now you can access the videos collection
//         // const video = await db.collection('videos').findOne();
//         // console.log(video);
//     } catch (err) {
//         console.error(err);
//     } finally {
//         await client.close();
//     }
// }

// run().catch(console.dir);

module.exports = client; 

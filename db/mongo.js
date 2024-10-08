const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Meet-dev:Meet%402315@cluster0.fcx15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
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

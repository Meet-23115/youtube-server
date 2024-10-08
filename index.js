// Import the express module
const express = require('express');
const cors = require('cors');


const client = require('./db/mongo');

async function run() {
    try {
        await client.connect();
        const db = client.db('Project-1'); // Replace with your database name
        
        const video = await db.collection('videos').find().toArray();
        // console.log(video);
    } catch (err) {
        console.error(err);
    } 
}

run().catch(console.dir);
const db = client.db('Project-1');


// Create an instance of an Express application
const app = express();
app.use(cors()); 


// Define a port to listen on
const PORT = 8080;

// Set up a simple route for the home page

app.post('/login',async (req, res)=>{
    
    const user = await db.collection('users').findOne();
    console.log(user._id)

    res.send(user)
})
app.post('/auth', async (req, res)=>{
    const user = await db.collection('users').findOne();
    console.log(user._id)

    res.send(user)
})
// app.get('/setupUser', async(req, res)=>{
//     const videos = await db.collection('videos').find().toArray();
    
//         const user = await db.collection('users').updateOne({name:"Meet"}, {$set:{
//             videos:videos
//         }});
//         // console.log(item)
    
    
//     // return user
    
//     res.send(videos)

// })
app.get('/topbar', (req, res) => {
    const topbarData = ['All', 'Music', 'Mixes', 'Gaming', 'Sitcoms', 'Karan Aujla', 'Web Series', 'Indian Pop Music', 'Lunches', 'Live', 'Gadgets', 'Computer Science', 'Comedy', 'Cars', 'Watched', 'New To You']
    res.send(topbarData);
});
app.get('/videos', async(req, res)=>{
    const videos = await db.collection('videos').find().toArray();
    // console.log(video);
    res.send(videos);
})


// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

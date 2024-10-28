import server from './server.js';
import connectDb from './src/db/mongo.js';
import dotenv from 'dotenv';


dotenv.config();

server.get('/',(req, res)=>{
    res.send('Hello World');
})

connectDb()
.then(()=>{
    const port = process.env.PORT || 8080
    server.listen(port, ()=>console.log(`server is listeing at port ${port}`))
})
.catch((err)=>{
    console.log('MONGODB connection failed !!! ', err)
})




// app.post('/login',async (req, res)=>{
    
//     const user = await db.collection('users').findOne();
//     console.log(user._id)

//     res.send(user)
// })
// app.post('/auth', async (req, res)=>{
//     const user = await db.collection('users').findOne();
//     console.log(user._id)

//     res.send(user)
// })


// app.get('/topbar', (req, res) => {
//     const topbarData = ['All', 'Music', 'Mixes', 'Gaming', 'Sitcoms', 'Karan Aujla', 'Web Series', 'Indian Pop Music', 'Lunches', 'Live', 'Gadgets', 'Computer Science', 'Comedy', 'Cars', 'Watched', 'New To You']
//     res.send(topbarData);
// });
// app.get('/videos', async(req, res)=>{
//     const videos = await db.collection('videos').find().toArray();
//     // console.log(video);
//     res.send(videos);
// })



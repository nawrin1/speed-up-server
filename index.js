const express=require('express')
const cors=require('cors')
const app=express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
const port=process.env.PORT || 5000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqv383i.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("carsDB");
    const carsCollection = database.collection("cars");
    
    const usersCollection=client.db('AllUserDB').collection("user")
    app.get('/allcars', async (req, res) => {
        const cursor = carsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/allcars/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await carsCollection.findOne(query);
        res.send(result);
    })
    app.post('/allcars',async(req,res)=>{
        const allCars=req.body
        console.log(allCars)
        const result=await carsCollection.insertOne(allCars)
        res.send(result)
    })
    app.post('/allusers',async(req,res)=>{
        const allUsers=req.body
        console.log(allUsers)
        const result=await usersCollection.insertOne(allUsers)
        res.send(result)
    })
    app.get('/allusers', async (req, res) => {
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('server is running')
})
app.listen(port,()=>{
    console.log(`brand server running on port:${port}`)
})
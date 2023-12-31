const express=require('express')
const cors=require('cors')
const app=express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
const port=process.env.PORT || 3000;





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
    const myCartCollection=client.db('CartDB').collection("myCart")
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
    app.post('/addCart',async(req,res)=>{
        const myCart=req.body
        console.log(myCart)
        const result=await myCartCollection.insertOne(myCart)
        res.send(result)
    })
    app.get('/addCart', async (req, res) => {
        const cursor = myCartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.delete('/addCart/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await myCartCollection.deleteOne(query);
        console.log(result)
        res.send(result);
    })
    app.get('/addCart/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await myCartCollection.findOne(query);
        res.send(result);
    })
    app.put('/allcars/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updated= req.body;

        const cars = {
            $set: {
                name: updated.name,
                brandName: updated.brandName,
                price: updated.price,
                image: updated.image,
                rating: updated.rating,
                type: updated.type,
               description: updated.description
            }
        }

        const result = await carsCollection.updateOne(filter, cars, options);
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
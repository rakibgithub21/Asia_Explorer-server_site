const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware:
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_TOUR_USER}:${process.env.DB_TOUR_PASSWORD}@cluster0.vq4rqer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
        // await client.connect();
        // Send a ping to confirm a successful connection

        const touristCollection = client.db("toursDB").collection('tours')

        app.get('/tourist-spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristCollection.findOne(query)
            res.send(result)
        })

        app.get('/tourist-spot-email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = touristCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/tourist-spot', async (req, res) => {
            const cursor = touristCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const data = req.body;
            const updateDoc = {
                $set: {
                    image: data.image,
                    tourist_spot: data.tourist_spot,
                    country: data.country,
                    location: data.location,
                    description: data.description,
                    cost: data.cost,
                    seasonality: data.seasonality,
                    travel: data.travel,
                    visitor: data.visitor,
                    email: data.email,
                    name: data.name
                }
            }
            const result = await touristCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristCollection.deleteOne(query);
            
            res.send(result)
        })

        app.post('/tourist-spot', async (req, res) => {
            const data = req.body;
            const result = await touristCollection.insertOne(data)
            res.send(result)

        })







        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('My server is running')
})

app.listen(port, () => {
    console.log(`my server is running on ${port}`);
})
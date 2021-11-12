const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const cors = require('cors');
// const e = require('express');
require('dotenv').config();

const port = process.env.PORT || 5000;


//middlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0tkjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("BikeShop");
        const usersCollection = database.collection("users");
        const productsCollection = database.collection("products")
        const ordersCollection = database.collection("orders");
        const homePdCollection = database.collection("homeProducts");
        const reviewsCollection = database.collection("reviews");


        // get home six products
        app.get('/homeProducts', async (req, res) => {
            const cursor = homePdCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // post order info
        app.post("/addOrders", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });
        // get all order and show order manage
        app.get('/addOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        // get order and show myOrder
        app.get("/addOrders/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
            console.log(result);
        });
        // delete from my order
        app.delete('/addOrders/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
            console.log(result);
        })

        // single product
        app.get("/singleProducts/:id", async (req, res) => {
            const result = await productsCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });
        // single product for home page
        app.get("/homeProducts/:id", async (req, res) => {
            const result = await homePdCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });

        // get products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // products data send in db
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })

        // delete the product
        app.delete('/products/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
            console.log(result);
        })


        // user register data send in db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        // user role admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })


        // get an admin email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // status update
        app.put("/addOrders/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await ordersCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
            console.log(result);
        });


        // review collection
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })

        // get review collection
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })


    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Welcome to super bike showroom!!')
})

app.listen(port, () => {
    console.log('super bike running at ', port)
})
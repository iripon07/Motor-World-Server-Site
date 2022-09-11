const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mexo0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const manageCollection = client.db("motorWorld").collection("manage");

    //Get All Inventories

    app.get("/manage", async (req, res) => {
      const query = {};
      const cursor = manageCollection.find(query);
      const manages = await cursor.toArray();
      res.send(manages);
    });

    //Delete a inventory
    app.delete("/manage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await manageCollection.deleteOne(query);
      res.send(result);
    });

    //Add A New Inventory
    app.post("/manage", async (req, res) => {
      const newInventory = req.body;
      const result = await manageCollection.insertOne(newInventory);
      res.send(result);
    });



    //Update Inventory
    app.put("/manage/:id", async(req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true}
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity
        }
      };
      const result = await manageCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    //Get Single Inventory using by Id;
    app.get("/manage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await manageCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Continue server");
});

app.listen(port, () => {
  console.log("Listening to port ", port);
});

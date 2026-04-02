import express from "express";
import dotenv from 'dotenv'

dotenv.config({ path: './config.env' });

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

console.log("record file loaded !");

// This section will help you get a list of all the records.
router.post("/call-analytics", async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if(apiKey == process.env.YOUR_SECRET_API_KEY){

        res.status(200).send("API key matched!");
    }else{
       res.status(401).send("Unauthorized: Invalid API Key"); 
    }   
});

// router.get("/call-analytics", async (req, res) => {
//     const apiKey = req.headers['x-api-key'];
//     if(apiKey == process.env.YOUR_SECRET_API_KEY){
//         console.log("api: " + process.env.YOUR_SECRET_API_KEY);
//         res.status(200).send("Success, the secret key is fetched!").status(200);
//     }else{
//         const err = "api key not found";
//         console.log(err);
//        res.status(200).send(err); 
//     }   
// });


// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
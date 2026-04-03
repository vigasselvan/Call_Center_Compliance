import express from "express";
import dotenv from 'dotenv'
import callGemini from '../services/callGemini.js';

dotenv.config({ path: './config.env' });


const router = express.Router();


router.post("/call-analytics", async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if(apiKey == process.env.YOUR_SECRET_API_KEY){
      const resp = await callGemini(req.body);
      res.status(200).send(resp);
    }else{
      console.log("!!! 401 !!!");
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

export default router;
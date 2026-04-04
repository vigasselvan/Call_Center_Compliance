import express from "express";
import dotenv from 'dotenv'
import callGemini from '../services/callGemini.js';

dotenv.config({ path: './config.env' });


const router = express.Router();


router.post("/api/call-analytics", async (req, res) => {
    const apiKey = req.headers['x-api-key'];

    //check valid API
    if(apiKey == process.env.YOUR_SECRET_API_KEY){
      const resp = await callGemini(req.body);
      res.status(200).send(resp);
    }else{
      console.log("!!! 401 !!!");
      res.status(401).send("Unauthorized: Invalid API Key"); 
    }   
});

router.get("/", async (req, res) => {
    res.status(200).send("Live");
});

export default router;
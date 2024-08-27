import * as v2 from "firebase-functions/v2";
import functions from "firebase-functions";
import {logger} from "firebase-functions";
import axios from "axios";
import cors from "cors";


cors({ origin: true });
//config();

export const access = functions
.region('europe-west2')
.https.onRequest(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");  
  const {userPwd} = req.query;
  logger.info("index.js -> access, userPwd: ", {pwd: userPwd});
  const dayPwd = new Date().getDate() + ("1512");
  if (userPwd === dayPwd) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});


export const fetchPlaces = functions.region('europe-west2')
.https.onRequest(async (req, res) => {  
  const {location, radius} = req.query;
  const tempKey = process.env.FBAPI;
  const apiKey = tempKey.replace(/'/g, "");
  console.log("fetch function, api: ", apiKey)  

  if (!apiKey) {
    logger.error("Google API Key not found", { api: apiKey });
    res.status(500).send("Google API key not found");
    return;
  }
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&key=${apiKey}`;
  functions.logger.info("place req url: ", { location: url });
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    //res.setHeader("Content-Type", "application/json");  
    const response = await axios.get(url);
    if (!response || !response.data){
      logger.error("No place data returned from Google API");
        res.status(500).json({ error: "No place data returned from Google API" });
      return;
    }
    logger.info("place resp: ", { resp: response.data });
    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error("Error fetching places from Google API", { error: error.message });
      res.status(500).json({ error: "Error fetching places from Google API", details: error.message });
  }
});

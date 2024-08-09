import * as v2 from "firebase-functions/v2";
import functions from "firebase-functions";
import logger from "firebase-functions/logger";
import axios from "axios";
import {config} from "dotenv";
import cors from "cors";


cors({origin: true});
config();

export const validateAddress = functions.https.onRequest(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  const apiKey = process.env.FBAPI;
  console.log("apiKey: ", apiKey);
  const {data} = req.body;
  console.log("data body: ", data);
  console.log("data params: ", req.params);
  console.log("validationAddress data from the req.body: ", data);
  const validateApiUrl = "https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}";
  const resp = axios.post(`${validateApiUrl}, ${data}`);
  res.send(resp.data);
});


export const getPlaces = functions.https.onRequest(async (req, res) => {
  // return cors(req, res, async () => {
  console.log("data: ", req.query);
  const location = req.query.location;
  const radius = req.query.radius;
  const apiKey = process.env.FBAPI;// functions.config().google.apiKey;
  logger.info("Api: ", {api: apiKey});

  if (!apiKey) {
    logger.error("Google API Key not found", {api: apiKey});
    res.status(500).send("Google API key not found");
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&key=${apiKey}`;

  logger.info("place req url: ", {url});
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    const response = await axios.get(url);
    res.status(response.status).json(response.data.results);
  } catch (error) {
    console.error("Error fetching places data:", error);
    res.status(500).send("Error fetching places data");
  }
});


/*
export const helloWorld = onRequest((request, response) => {
  debugger;
  logger.info("Hello logs!", { structuredData: true });
  const name = request.params[0];
  const items = { lamp: "This is a lamp", chair: "Good chair" };
  const message = items[name];
  response.send(`<h1>${message}</h1>`);
});
*/

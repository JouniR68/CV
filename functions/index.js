import * as v2 from "firebase-functions/v2";
import functions from "firebase-functions";
import logger from "firebase-functions/logger";
import axios from "axios";
import {config} from "dotenv";
import cors from "cors";


cors({origin: true});
config();

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
  // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}`;
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
  // },
  // );
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

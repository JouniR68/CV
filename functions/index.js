import * as v2 from "firebase-functions/v2";
import functions from "firebase-functions";
import logger from "firebase-functions/logger";
import axios from "axios";
//import { config } from "dotenv";
import cors from "cors";


cors({ origin: true });
//config();

/*
const {google} = require('googleapis');
const container = google.container('v1beta1');


exports.cleanupGCR = async (req, res) => {
  try {
    const projectId = 'firma-ed35a';
    const repository = 'your-repository';
    const cutoffDate = new Date();
    cutoffDate.setMonths(cutoffDate.getMonth() - 3); // e.g., images older than 3 months

    // List images
    const listResponse = await google.container.images.list({
      parent: `projects/${projectId}/locations/global/repositories/${repository}`,
    });

    // Delete old images
    const deletePromises = listResponse.data.images
      .filter(image => new Date(image.updateTime) < cutoffDate)
      .map(image => google.container.images.delete({
        name: image.name,
      }));

    await Promise.all(deletePromises);

    res.status(200).send('Old images cleaned up.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during image cleanup.');
  }
};
*/


export const access = functions
.region('europe-west2')
.https.onRequest(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  logger.info("FB index.js, access:", {userPwd : req.query.userPwd})
  const {userPwd} = req.query;
  logger.info("userPwd: ", {pwd: userPwd});
  const dayPwd = new Date().getDate() + ("1512");
  if (userPwd === dayPwd) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});


export const fetchPlaces = functions.region('europe-west2')
.https.onRequest(async (req, res) => {
  logger.info("fetchPlaces query: ", {query_data: req.query.data});
  const location = req.query.location;
  const radius = req.query.radius;
  const apiKey = process.env.FBAPI;
  logger.info("Api: ", { api: apiKey });

  if (!apiKey) {
    logger.error("Google API Key not found", { api: apiKey });
    res.status(500).send("Google API key not found");
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&key=${apiKey}`;

  logger.info("place req url: ", { location: url });
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    const response = await axios.get(url);
    logger.info("place resp: ", { resp: response.data });
    res.status(response.status).json(response.data.results);
  } catch (error) {
    console.error("Error fetching places data:", error);
    res.status(500).send("Error fetching places data");
  }
});

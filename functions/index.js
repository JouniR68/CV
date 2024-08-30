/* eslint-disable linebreak-style */
import * as v2 from "firebase-functions/v2";
import functions from "firebase-functions";
import {logger} from "firebase-functions";
import axios from "axios";
import cors from "cors";


cors({origin: true});
// config();

export const access = functions
    .region("europe-west2")
    .https.onRequest(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");
      const userPwd = req.query.userPwd;
      logger.info("index.js -> access, userPwd: ", {pwd: userPwd});
      const dayPwd = new Date().getDate() + ("1512");
      if (userPwd === dayPwd) {
        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    });


export const fetchPlaceDetails = functions.region("europe-west2")
    .https.onRequest(async (req, res) => {
      console.log("fetchPlaceDetails index.js");
      // Fetch detailed information about the place using the Place Details API
      const {placeId} = req.query;
      const tempKey = process.env.FBAPI;
      const apiKey = tempKey.replace(/'/g, "");
      console.log("Params:", placeId, "with API Key:", apiKey);
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
      console.log("url: ", url);

      try {
        const response = await axios.get(url);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (!response) {
          console.log("No place details response available");
          return;
        }
        console.log("place details response: ", response.data);
        if (response.data.status === "OK") {
          console.log("url data: ", response.data.url);
          // return response.data.result;
          res.status(response.status).json(response.data);
        } else {
          console.error(response.data.status, response.data.error_message);
          res.status(400)
              .json({error: response.data.error_message ||
        "Error fetching place details"});
        }
      } catch (error) {
        console.error("Error with Place Details API:", error.message || error);
        res.status(500).json({error: "Internal Server Error"});
      }
    });


export const fetchPlaces = functions.region("europe-west2")
    .https.onRequest(async (req, res) => {
      const {location, radius} = req.query;
      console.log("radius (not in use..): ", radius);
      const tempKey = process.env.FBAPI;
      const apiKey = tempKey.replace(/'/g, "");
      console.log("fetch function, api: ", apiKey);

      if (!apiKey) {
        logger.error("Google API Key not found", {api: apiKey});
        res.status(500).send("Google API key not found");
        return;
      }
      // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&key=${apiKey}`;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&rankby=distance&key=${apiKey}`;

      // https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos&key=${apiKey}

      functions.logger.info("place req url: ", {location: url});
      try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        // res.setHeader("Content-Type", "application/json");
        const response = await axios.get(url);
        if (!response || !response.data) {
          logger.error("No place data returned from Google API");
          res.status(500)
              .json({error: "No place data returned from Google API"});
          return;
        }
        logger.info("place resp: ", {resp: response.data});
        res.status(response.status).json(response.data);
      } catch (error) {
        logger.error("Error fetching places from Google API"
            , {error: error.message});
        res.status(500)
            .json({error: "Error from Google API", details: error.message});
      }
    });

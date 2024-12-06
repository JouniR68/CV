/* eslint-disable linebreak-style */
// import { onUserCreated } from 'firebase-functions/v2/auth';
import functions from "firebase-functions/v2";
import { logger } from "firebase-functions";
import axios from "axios";
import cors from "cors";
import admin from "firebase-admin"


admin.initializeApp();

cors({ origin: true });
// config();

export const access = functions.https.onRequest({
  region: "europe-west2",
}, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const userPwd = req.query.userPwd;
  logger.info("index.js -> access, userPwd: ", { pwd: userPwd });

  const dayPwd = new Date().getDate() + "1512";
  if (userPwd === dayPwd) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

export const fetchPlaceDetails = functions.https.onRequest({
  region: "europe-west2",
}, async (req, res) => {
  const { placeId } = req.query;
  const apiKey = process.env.FBAPI?.replace(/'/g, ""); // Safely retrieve the key

  if (!apiKey) {
    res.status(500).json({ error: "API key not configured" });
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  logger.info("Fetching place details from URL:", { url });

  try {
    const response = await axios.get(url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (response.data.status === "OK") {
      res.status(200).json(response.data);
    } else {
      logger.error("Error from Google API", { status: response.data.status, message: response.data.error_message });
      res.status(400).json({ error: response.data.error_message || "Error fetching place details" });
    }
  } catch (error) {
    logger.error("Error with Place Details API:", { message: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const fetchPlaces = functions.https.onRequest({
  region: "europe-west2",
}, async (req, res) => {
  const { location, radius } = req.query;
  const apiKey = process.env.FBAPI?.replace(/'/g, "");

  if (!apiKey) {
    logger.error("Google API Key not found", { api: apiKey });
    res.status(500).send("Google API key not found");
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&rankby=distance&key=${apiKey}`;
  logger.info("Fetching places with URL:", { url });

  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const response = await axios.get(url);

    if (!response || !response.data) {
      logger.error("No place data returned from Google API");
      res.status(500).json({ error: "No place data returned from Google API" });
      return;
    }

    logger.info("Place response received", { data: response.data });
    res.status(200).json(response.data);
  } catch (error) {
    logger.error("Error fetching places from Google API", { message: error.message });
    res.status(500).json({ error: "Error from Google API", details: error.message });
  }
});


export const createNotification = (notification) => {
  return admin.firestore().collection('notifications').add(notification);
};
/*
export const userJoined = onUserCreated({region: 'europe-west2'}, async (event) => {
  const user = event.data; // Access user object from the event
  logger.info(`New user created: ${user.email}`);

  try {
    // Check for user document in Firestore
    const userDoc = await admin.firestore().collection('contacts').doc(user.email).get();

    if (!userDoc.exists) {
      logger.error(`No user document found for email: ${user.email}`);
      return null;
    }

    const newUser = userDoc.data();
    const notification = {
      content: 'Joined the party',
      user: `${newUser.firstName} ${newUser.lastName}`,
      time: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Assuming createNotification is defined elsewhere
    return createNotification(notification);
  } catch (err) {
    logger.error('Error creating notification:', err);
    return null;
  }

  return null; // Ensure a return value is provided
});
*/
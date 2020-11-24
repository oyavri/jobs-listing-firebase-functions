const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const db = admin.firestore();
const listingsRef = db.collection('listings');

const createJobListing = async (req, res, next) => {
  const { title, jobPosition, requiredExperience, requiredSkills, jobInfo, workSchedule, location, isOnline } = req.body;
  const data = {
    title: title,
    jobPosition: jobPosition,
    requiredExperience: requiredExperience,
    requiredSkills: requiredSkills,
    jobInfo: jobInfo,
    workSchedule: workSchedule,
    location: location,
    isOnline: isOnline
  };

  listingsRef.add(data)
  .catch(err => {
    console.log(`An error occured at adding data to firestore: ${err}`);
    next(err)
  });

  res.send({
    isSuccessful: true,
    ...data
  });
}

const getJobListings = async (req, res, next) => {
  const listings = [];
  listingsRef.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        listings.push({"id": doc.id, ...doc.data()});
      })
    })
    .then(() => {
      console.log(listings);
      res.send(listings);
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const requestLogger = (req, res, next) => {
  console.log(`The request method is: ${req.method} and the request body is: ${JSON.stringify(req.body)}`);
  next();
}

const errorLogger = (err, req, res, next) => {
  console.log(err);
  functions.logger.info("Error: ", err);
  next(err);
}

const app = express();

app.use('/', requestLogger);

app.use(cors({ origin: true }));

app.use('/', errorLogger);

app.post('/createJobListing', createJobListing);

app.get('/getListings', getJobListings);

exports.jobsListing = functions.https.onRequest(app);

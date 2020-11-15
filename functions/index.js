const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const createJobListing = async (req, res) => {
  if (req.method !== 'POST') res.send('Only post requests is allowed.');
  const { title, jobPosition, requiredExperience, requiredSkills, jobInfo, workSchedule, location } = req.body;
  const data = {
    title: title,
    jobPosition: jobPosition,
    requiredExperience: requiredExperience,
    requiredSkills: requiredSkills,
    jobInfo: jobInfo,
    workSchedule: workSchedule,
    location: location
  };

  await db.collection('listings').add(data);

  res.send({
    isSuccessful: true,
    data
  });
}

/*
const getJobListings = async (req, res) => {

} 
*/

exports.createListing = functions.https.onRequest(createJobListing);

// exports.getListings = functions.https.onRequest(getJobListings);

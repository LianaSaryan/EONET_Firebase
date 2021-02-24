const firebase = require('firebase');
const request = require('request');

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC1r2fyaoEozc1SptZ0CFRSlykgK6D74c4",
    authDomain: "disastermap-b3f45.firebaseapp.com",
    projectId: "disastermap-b3f45",
    storageBucket: "disastermap-b3f45.appspot.com",
    messagingSenderId: "586159893223",
    appId: "1:586159893223:web:4fa0eca823868b2a269042",
    measurementId: "G-VCV93E6R2C"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

var id;
var title;
var description;
var link;
var categories;
var sources;
var geometry;

// Request events data from API
function requestEvents()
{
    request('https://eonet.sci.gsfc.nasa.gov/api/v3/events?limit=3', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        
        var events = body.events;

        var i;
        for (i = 0; i < events.length; i++) 
        {
            id = events[i].id; 
            title = events[i].title; 
            description = events[i].description; 
            link = events[i].link; 
            categories = events[i].categories; 
            sources = events[i].sources;
            geometry = events[i].geometry;
            /* Display for Testing
                console.log(id);
                console.log(title);
                console.log(description);
                console.log(link);
                console.log(categories);
                console.log(sources);
                console.log(geometry);
            */
            writeEventData(id, title, description, link, categories, sources, geometry);
        }
    });
}

// Write to database 
function writeEventData(id, title, description, link, categories, sources, geometry) {
    firebase.database().ref('Events/' + id).set({
        title: title,
        description: description,
        link : link,
        categories: categories,
        sources: sources,
        geometry: geometry
      });
}

// Read from database
// Reading specific event -> EONET_5247
function readEventData(){
    database.ref('Events').child("EONET_5247").get().then(function(snapshot) {
        if (snapshot.exists()) {
            console.log(snapshot.child('title').val());
            console.log(snapshot.child('description').val());
            console.log(snapshot.child('link').val());
            console.log(snapshot.child('categories').val());
            console.log(snapshot.child('sources').val());
            console.log(snapshot.child('geometry').val());
        }
        else {
          console.log("No data available");
        }
      }).catch(function(error) {
        console.error(error);
      });
}


// Read from database
// Reading all events
function readAllEventsData()
{
    database.ref('Events').get().then(function(snapshot) {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        }
        else {
          console.log("No data available");
        }
      }).catch(function(error) {
        console.error(error);
      });    
}


requestEvents();
readEventData();
readAllEventsData();
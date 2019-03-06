// DEPENDENCIES
// Read and set environment variables
require("dotenv").config();

// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Import the API keys
var keys = require("./keys");

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);


// Grabbing the input from the CLI

var userInput = process.argv[2];

var userCommand = process.argv.slice(3).join(" ");

//liri comands
// Concert-when
// Spotify-this
// Movie-this
// Follow-my-command

//switch-case statement to direct the functions 

function LiriListening (userInput, userCommand) {
  switch (userInput){
    case "Concert-when":
      getMyBands(userCommand);
      break;

    case "Spotify-this":
      getMeSpotify(userCommand);
      break;

    case "Movie-this":
      getMeMovie(userCommand);
      break;
    
    case "Follow-my-command":
      doWhatItSays(userCommand);
      break;

    default:
    console.log("Please select on of these commands 'Concert-when', 'Spotify-this', 'Movie-this', 'Follow-my-command' ");

  }
};

// FUNCTIONS
// =====================================
// Using Bands in Town for concert-this
function getMyBands(artist) {
  var artist = userCommand;
  var artistQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

  // axios.get function takes in a URL and returns a promise (just like $.ajax)
  axios.get(artistQuery).then(
      function (response) {
          console.log("--------------------");
          console.log("Venue Name: " + response.data[0].venue.name + "\r\n");
          console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
          console.log("Event Date: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

          // Finally, we append to log.txt
          var logArtistEvent = "----------Bands in Town Info----------" + "\n Artist(s): " + artist + "\n Venue Name: " + response.data[0].venue.name + "\n Venue Location: " + response.data[0].venue.city + "\n Event Date: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "--------------------" + "\n";

          fs.appendFile("log.txt", logArtistEvent, function (err) {
              if (err) throw err;
          });
  });
};



// Using Spotify for spotify-this-song
function getMeSpotify(songName) {
  // No, we use the Spotify keys
  var spotifyKey = new Spotify(keys.spotify);

  // If the song name is left blank, add the following song as default
  if (!songName) {
      songName = "Don't";
  };

  // Next, we are creating the search logic
  spotifyKey.search({
      type: "track",
      query: songName,
      limit: 5
      // adding error message
  }, function (err, data) {
      if (err) {
          return console.log("ERROR OCCURRED: " + err);
          // If no error happens (sourcing is successful), give us the following
      } 
          console.log("--------------------");
          console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name + "\r\n");
          console.log("Song: " + data.tracks.items[0].name + "\r\n");
          console.log("Link to sample: " + data.tracks.items[0].href + "\r\n");
          console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

              // Finally, we append to log.txt
              var logSong = "----------Spotify Music Info----------" + "\n Artist(s): " + data.tracks.items[0].album.artists[0].name + "\n Song: " + data.tracks.items[0].name + "\n Link to sample: " + data.tracks.items[0].href + "\n Album: " + data.tracks.items[0].album.name + "--------------------" + "\n";
              fs.appendFile("log.txt", logSong, function (err) {
                  if (err) throw err;
              });
          

      });
};


// Using OMDB for movie-this
function getMeMovie(movie) {
  // If the song name is left blank, add the following movie as default
  if (!movie) {
      movie = "The Matrix";
  };

  // Next, we are creating the search logic
  var movieQuery = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.request(movieQuery).then(
      function (response) {
          // console.log(response);
          // If no error happens (sourcing is successful), give us the following
          console.log("--------------------");
          console.log("Movie Title: " + response.data.Title + "\r\n");
          console.log("Year: " + response.data.Year + "\r\n");
          console.log("IMBD Rating: " + response.data.imdbRating + "\r\n");
          console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
          console.log("Country Produced: " + response.data.Country + "\r\n");
          console.log("Language: " + response.data.Language + "\r\n");
          console.log("Plot: " + response.data.Plot + "\r\n");
          console.log("Actors: " + response.data.Actors + "\r\n");

              // Finally, we append to log.txt
              var logMovie = "----------OMDB Info----------" + "\n Movie Title: " + response.data.Title + "\n Year: " + response.data.Year + "\n IMBD Rating: " + response.data.imdbRating + "\n Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n Country Produced: " + response.data.Country + "\n Language: " + response.data.Language + "\n Plot: " + response.data.Plot + "\n Actors: " + response.data.Actors + "--------------------" + "\n";

              fs.appendFile("log.txt", logMovie, function (err) {
                  if (err) throw err;
              });
          });
};


// Random Feature Function
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) {
          return console.log(err);
      } else {
          console.log(data);

          var randomData = data.split(",");
          LiriListening(randomData[0], randomData[1]);
      };
  });
};


// Function to log results to other functions
function logResults(data) {
  fs.appendFile("log.txt", data, function (err) {
      if (err) throw err;
  });
};


// Calling the search command function
LiriListening(userInput, userCommand)

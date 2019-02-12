require("dotenv").config();

const keys = require("./keys.js");
const moment = require('moment');
moment().format();
const axios = require("axios");
const Spotify = require('node-spotify-api');
const spotifyKey = new Spotify(keys.spotify);
const fs = require("fs");
const request = require("request");
const input = process.argv;
const action = input[2];
const inputs = input[3];

// The switch-case will direct which function gets run.
switch (action) {
  case "spotify-this-song":
    spotifyThis(inputs);
    break;

  case "movie-this":
    movie(inputs);
    break;

  case "concert-this":
    bandsintown(inputs);
    break;

  case "do-what-it-says":
    doit();
    break;
};

// calling spotify artist / song details
function spotifyThis(inputs) {
  if (!inputs) {
    inputs = 'The Sign ace of ace';
  }
  // console.log(inputs);
  spotifyKey.search({ type: 'track', query: inputs }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("Song Name: " + inputs);
  });

};

// calling omdb for movie details
function movie(inputs) {
  if (!inputs) {
    inputs = 'Mr Nobody';
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl);


  axios.get(queryUrl).then(
    function (response) {
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Released);
      console.log("IMDB rating: " + response.data.imdbRating);
      console.log("Rotten tomatoes rating: " + response.data.Ratings[0].Value);
      console.log("Country produced: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    }
  );
};

// calling bands in town for concert detials
function bandsintown(inputs) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    inputs +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function (response) {
  
    console.log("Name of the venue: " + response.data[0].venue.name);
    console.log("Venue location: " + response.data[0].venue.city);
    console.log("Date of the event: " + moment(response.data[0].datetime).format("MM-DD-YYYY"));
  });
}

// doit function
function doit() {
	fs.readFile("random.txt", "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotifyThis(songcheck);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} else if (dataArr[0] === "concert-this") {
			var concert_date = dataArr[1].slice(1, -1);
			bandsintown(concert_date);
		}
		
  	});

};




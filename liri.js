require("dotenv").config();
var keys = require("./keys.js");
const fs = require('fs');
let axios = require('axios');
var Spotify = require('node-spotify-api');

let moment = require('moment');
let request = require('request');

var spotify = new Spotify(keys.spotify);

// ---------------------------writetolog random.txt

function writeToLog(data) {
    fs.appendFile("random.txt", '\r\n\r\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.appendFile("random.txt", (data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(space + "random.txt was updated!");
    });
}

// ---------------------------


var cmd = process.argv[2];
var input = process.argv[3];
var argThree = process.argv[4];
var argFour = process.argv[5];

let space = "\n"

// ---------------------------
search = input;

if (!argThree && !argFour) {
    console.log(space)
} else if (!argFour) {
    search = (input + "+" + argThree);
} else {
    search = (input + "+" + argThree + "+" + argFour);
    console.log("the search string is: " + search)
};
// ---------------------------

switch (cmd) {
    case "concert-this":
        concertThis(input);
        break;
    case "spotify-this-song":
        spotifyThisSong(search);
        break;
    case "movie-this":
        movieThis(input);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log(" line 51 ")
}





// node liri.js concert-this <artist/band name here>
// ------------------------------------------------------   ** kinda works
function concertThis(search) {

    if (!search) {
        search = "Shakira";
    }

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("response: ", response)

            var showDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            output = space + header +
                space + 'Artist: ' + search +
                space + 'Venue: ' + response.data[0].venue.name +
                space + 'Date: ' + showDate +
                // space + 'Date: ' + response.data[0].formatted_datetime +
                space + 'Location: ' + response.data[0].venue.city + " " + response.data[0].venue.region + " " + response.data[0].venue.country;

            console.log(output);
            writeToLog(output);
        })
        .catch(function (error) {
            console.log("---------------------------")
            console.log("err : ", error);
        });
};
// events api search
// ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")

// // renders back in console
// -Name of the venue

// =Venue location

// -Date of the Event (use moment to format this as "MM/DD/YYYY")
// ------------------------------------------------------






// node liri.js spotify-this-song '<song name here>'
// ------------------------------------------------------   ** works
function spotifyThisSong(search) {
    if (!search) {
        search = "Californiacation"
    }
    spotify.search({ type: 'track', query: search }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output =
                space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                space + "Song Name: " + data.tracks.items[0].name +
                space + "URL: " + data.tracks.items[0].album.external_urls.spotify +
                space + "Album Name: " + data.tracks.items[0].album.name + space;
            console.log(output);
            writeToLog(output);
        }
    });
};
// spotify - this - song
// node-spotify-api package
// > SPOTIFY_ID
// > SPOTIFY_SECRET  
// If no song is provided then your program will default to "The Sign" by Ace of Base.
// renders back in console

// Artist(s)
// - The song's name
// - A preview link of the song from Spotify
// The album that the song is from

// ------------------------------------------------------------











// node liri.js movie-this '<movie name here>'
// ------------------------------------------------------------ ** works


function movieThis(search) {
    if (!search) {
        search = "The Matrix"
    }

    let URL = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=" + "879a15d0";

    request(URL, function (err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            output =
                space + 'Title: ' + jsonData.Title +
                space + 'Release Year: ' + jsonData.Year +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors + space;

            // Output in console
            //   * Title of the movie.
            //   * Year the movie came out.
            //   * IMDB Rating of the movie.
            //   * Rotten Tomatoes Rating of the movie.
            //   * Country where the movie was produced.
            //   * Language of the movie.
            //   * Plot of the movie.
            //   * Actors in the movie.

            console.log(output);
            writeToLog(output);
        }
    });

};
// movie - this
// axios OMDB API      API key.You may use trilogy


// var nodeArgs = process.argv;
// // Create an empty variable for holding the movie name
// var movieName = "";
// // Loop through all the words in the node argument
// // And do a little for-loop magic to handle the inclusion of "+"s
// for (var i = 2; i < nodeArgs.length; i++) {

//   if (i > 2 && i < nodeArgs.length) {
//     movieName = movieName + "+" + nodeArgs[i];
//   } else {
//     movieName += nodeArgs[i];

//   }
// }
// var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
// // This line is just to help us debug against the actual URL.
// console.log(queryUrl);
// axios.get(queryUrl).then(
//   function(response) {
//     console.log("Release Year: " + response.data.Year);
//   })
//   .catch(function(error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log("---------------Data---------------");
//       console.log(error.response.data);
//       console.log("---------------Status---------------");
//       console.log(error.response.status);
//       console.log("---------------Status---------------");
//       console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an object that comes back with details pertaining to the error that occurred.
//       console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log("Error", error.message);
//     }
//     console.log(error.config);
//   });


// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/ 
// It's on Netflix!

// -----------------------------------------------------------








//   node liri.js do-what-it-says
// ----------------------------------------------------------- ** kinda works
function doWhatItSays() {
    // whatdo = ""


    // function getRandom() {
    //     return Math.random();
    //   }

    //   Math.floor(Math.random() * 6)


    //  `node liri.js do-what-it-says`
    rando = Math.floor(Math.random() * 3);
    console.log("randomly generated number : ", rando);
    switch (rando) {
        case 0:     //i want it that way
            fs.readFile("spotify.txt", "utf8", function (error, data) {
                randomsong = data;
                console.log("spotify text : ", randomsong)
                spotifyThisSong(randomsong);
                if (error) {
                    return console.log(error);
                }
            });

        case 1:     //titanic
            fs.readFile("movies.txt", "utf8", function (error, data) {
                randommovie = data;
                console.log("movie text : ", randommovie);
                movieThis(randommovie);
                if (error) {
                    return console.log(error);
                }
            });
        case 2:     //aladdin
            fs.readFile("artist.txt", "utf8", function (error, data) {
                randomartist = data;
                console.log("artist name : ", randomartist);
                movieThis(randomartist);
                if (error) {
                    return console.log(error);
                }
            });

    };


    // Using the fs Node package LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.

    // Edit the text in random.txt to test out the feature for movie-this and concert-this.

}
const jokes = require("give-me-a-joke")
// console.dir(jokes)
const color = require("colors");
jokes.getRandomDadJoke(function (joke) {
    console.log(joke.rainbow);
});
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const users = [];
const usersToReturn = [];

app.post("/api/users", (req, res) => {
  let [part1, part2, part3] = req.body.username.split("_");

  users.push({
    username: `${part1}_${part2}`,
    _id: part3,
    count: 0,
    log: [],
  });

  // console.log(users[users.length - 1]);
  res.send(users[users.length - 1]);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.get("/api/users", (req, res) => {
  // console.log(users);
  res.send(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let { description, duration, date } = req.body;

  if (typeof date === "undefined") {
    date = new Date();
  } else {
    date = new Date(date);
  }

  const Exercise = {
    description: description,
    duration: Number(duration),
    date: date.toDateString(),
  };

  let userToParse;
  for (user of users) {
    if (user._id === req.params._id) {
      userToParse = user;

      user.count += 1;
      user.log.push(Exercise);
    }
  }

  res.send({
    username: userToParse.username,
    _id: userToParse._id,
    description: description,
    duration: Number(duration),
    date: date.toDateString(),
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  
  
  const { from, to, limit } = req.query;
  console.log(from, to, limit);
  

  let userToParse;
  for (user of users) {
    if (user._id === req.params._id) {
      userToParse = Object.assign({}, user);



      if (typeof limit !== 'undefined') {
        console.log('Slicing array of logs');
        userToParse.log = userToParse.log.slice(0,limit);
      }


      
    }
  }

  console.log(JSON.stringify(userToParse, null, "\t"));
  res.send(userToParse);
});

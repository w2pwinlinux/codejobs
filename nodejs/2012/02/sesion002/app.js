var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

//Database
mongoose.connect('mongodb://localhost/codejobs');

//Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema; //Schema.ObjectId

//Followers Model

var Followers = new Schema({
    name: { type: String, required: true },
    last: { type: String, required: true },
    age: { type: Number, required: false},
    twitter: { type: String, unique: true },
    modified: { type: Date, default: Date.now }
});

var FollowerModel = mongoose.model('Followers', Followers);

// REST api
app.get('/api', function (req, res) {
  res.send('Server is running');
});

// Create Followers
app.post('/api/followers', function (req, res) {

  var follower;
  console.log("POST: ");
  console.log(req.body);

  follower = new FollowerModel({
    name: req.body.name,
    last: req.body.last,
    age: req.body.age,
    twitter: req.body.twitter,
  });

  follower.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(follower);
});

//List Followers
app.get('/api/followers', function (req, res) {
  return FollowerModel.find(function (err, follower) {
    if (!err) {
      return res.send(follower);
    } else {
      return console.log(err);
    }
  });
});

//Search follower
app.get('/api/followers/:id', function (req, res) {
  return FollowerModel.findById(req.params.id, function (err, follower) {
    if (!err) {
      return res.send(follower);
    } else {
      return console.log(err);
    }
  });
});

//PUT Update
app.put('/api/followers/:id', function (req, res) {
  return FollowerModel.findById(req.params.id, function (err, follower) {
    follower.name = req.body.name;
    follower.last = req.body.last;
    follower.age = req.body.age;
    follower.twitter = req.body.twitter;
    return follower.save(function (err) {
      if (!err) {
        console.log("Updated");
      } else {
        console.log(err);
      }
      return res.send(follower);
    });
  });
});


// DELETE ALL
app.delete('/api/followers', function (req, res) {
  FollowerModel.remove(function (err) {
    if (!err) {
      console.log("Remove");
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

//Remove
app.delete('/api/followers/:id', function (req, res) {
  return FollowerModel.findById(req.params.id, function (err, follower) {
    return follower.remove(function (err) {
      if (!err) {
        console.log("Remove");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(3030);

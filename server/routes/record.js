const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Upload CSV file for first time
const ctj = require("csvtojson");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const { Console } = require("console");

// This section will help you get a list of all the records.
recordRoutes.route("/survey").get(function (req, res) {
  let db_connect = dbo.getDb("moralsurvey");
  var questions_create = true;


  var initPromise = new Promise((resolve, reject) => {
    {
      db_connect.listCollections({ name: "questions" })
        .next(function (err, collinfo) { if (collinfo) { questions_create = false; } resolve(questions_create) });
    }
  });
  initPromise.then(function (data) {
    if (data) {
      console.log("Add all question for first initialization");
      ctj().fromFile('mfq_question.csv').then((jsonObj) => {
        db_connect.collection("questions")
          .insertMany(jsonObj, { ordered: true });
      })
    }
  }).then(function () {
    console.log("Selecting 10 random questions");
    db_connect.collection("questions").find({}, { projection: { surveyname: 1, questiontext: 1, varname: 1 } })
      .toArray().then(function (result) {
        selectedSet = myRandomRows();
        result = result.filter((x, index) => { return selectedSet.has(index); });
        result.forEach((node) => node["selectedoption"] = "")
        result["submissiontime"] = "";
        result["creationdatetime"] = "";
        res.json(result);
      })
  })
});

function myRandomRows() {
  const set = new Set();
  while (set.size < 10) {
    set.add(Math.floor(Math.random() * 36));
  }
  return set;
}

// Tou get single question record by id
recordRoutes.route("../survey/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("questions")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// To create single new survey record.
recordRoutes.route("/survey/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {};
  for (var key in req.body) {
    var cpy_post = {
      surveyname: req.body[key].surveyname,
      questiontext: req.body[key].questiontext,
      varname: req.body[key].varname,
      selectedoption: req.body[key].selectedoption,
    }
    myobj[key] = cpy_post;
  }
  myobj["submissiontime"] = req.body.submissiontime;
  myobj["creationdatetime"] = req.body.creationdatetime / 1000;
  db_connect.collection("responses").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// To update a question record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      questiontext: req.body.questiontext,
      surveyname: req.body.surveyname,
      varname: req.body.varname,
      scaletype: req.body.scaletype,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3,
      option4: req.body.option4,
      option5: req.body.option5,
      option6: req.body.option6,
      option7: req.body.option7
    }
  };
  db_connect.collection("questions")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 Master Data Question updated");
      response.json(res);
    });
});

// To delete a question record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("questions").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 Master Data Question deleted");
    response.json(obj);
  });
});

function flatten_json(data) {
  var final_result = [], result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      try{
        if(String(prop).charAt(0)==='_')
          return;
      }catch(e){console.log("Err"+cur);return;}
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
    }
  }
  for (let i = 0; i < data.length; i++) {
    result = {};
    recurse(data[i], '');
    final_result[i] = result;
  }
  return final_result;
}

// To download all survey responses in a CSV
recordRoutes.route("/survey/dwnldres").get(function (req, res) {
  let db_connect = dbo.getDb();
  console.log("Downloading CSV file")
  db_connect.collection("responses").find({}).toArray().then(function (result) {
    res.json(result);
    flatresult = flatten_json(result);
    console.log(flatresult);
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(flatresult);
    fs.writeFile("moral_survey_responses.csv", csvData, function (err, result) {
      if (err) console.log('error', err);
    });
    console.log("Downloaded");
  });
});


module.exports = recordRoutes;

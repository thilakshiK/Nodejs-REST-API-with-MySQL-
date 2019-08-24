const express = require("express"); //import express module
const app = express(); // create an express application
const bodyparser = require("body-parser");
const mysql = require("mysql");

app.use(bodyparser.json()); //tell the system to use json
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

//create database connection

const dbconn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

dbconn.connect();

// default route
app.get("/", (req, res) => {
  return res.send({ error: true, message: "hello" });
});

//Get all users
app.get("/users", (req, res) => {
  dbconn.query("SELECT * FROM users", (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: "user list" });
  });
});

//set port
app.listen(5000, () => {
  console.log("node app is running on port 5000");
});

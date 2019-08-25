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

dbconn.connect(error => {
  if (error) throw error;
  console.log("Connected!");
});

// default route
app.get("/", (req, res) => {
  return res.send("Hello World !"); //Sends the HTTP response
});

//Get all users
app.get("/users", (req, res) => {
  dbconn.query("SELECT * FROM users", (error, results, fields) => {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "user list"
    });
  });
});

//Get a single user

app.get("/users/:id", (req, res) => {
  const user_id = req.params.id;
  if (user_id == 0) {
    return res
      .status(404)
      .send({ error: true, message: "please provide a valid user id" });
  }
  dbconn.query(
    "SELECT * FROM users WHERE id=?",
    user_id,
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results[0] });
    }
  );
});

//Add a user

app.post("/add", (req, res) => {
  dbconn.query(
    "INSERT INTO users VALUES ('" +
      req.body.id +
      "','" +
      req.body.name +
      "', '" +
      req.body.email +
      "')",
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results });
    }
  );
});

//Delete user

app.delete("/delete", (req, res) => {
  const user_id = req.body.id;
  if (!user_id) {
    return res.status(404).send("Please provide a user id");
  }

  dbconn.query(
    "DELETE FROM users WHERE id = ?",
    [user_id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results });
    }
  );
});

//update user

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;

  dbconn.query(
    "UPDATE users SET name = ? , email = ?  WHERE id = ? ",
    [name, email, id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results });
    }
  );
});

//set port
const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`node app is running on port ${port}`);
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const User = require("./schema.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MONGO_URL = process.env.DB_CONNECTION;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(8080, () => {
      console.log("Server listening on port 8080");
    });
  })
  .catch((err) => console.log(err));
app.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newUser = new User({ name, email, message });
    await newUser.save();

    console.log(newUser);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving data");
  }
});


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const User = require("./schema.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MONGO_URL = process.env.DB_CONNECTION;
const PORT = process.env.PORT || 8080;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newUser = new User({ name, email, message });
    await newUser.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving data");
  }
});

const express = require("express");
const { UserModel } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.send("users page");
});

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (user) {
    return res.send({ msg: "User already registered" });
  }
  try {
    user = new UserModel(req.body);
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(400).send({ err: err.message });
      } else {
        user.password = hash;
        await user.save();
        res.status(200).send({ msg: "New user has been added" });
      }
      // Store hash in your password DB.
    });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.send({ msg: "Please login first" });
  }
  try {
    let userdata = await bcrypt.compare(password, user.password);
    if (!userdata) {
      return res.send(400).send({ msg: "Wrong credentials" });
    } else {
      const token = jwt.sign({ authorId: user.id }, "aditya");
      res.send({ msg: "User login success", token });
    }
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

module.exports = {
  userRouter,
};

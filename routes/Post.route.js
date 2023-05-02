const express = require("express");
const postRouter = express.Router();
const { PostModel } = require("../models/Post.model");

postRouter.get("/", async (req, res) => {
  let { authorId } = req.body;
  let userdata = await PostModel.find();
  res.send(userdata);
});

postRouter.post("/add", async (req, res) => {
  const newpost = new PostModel(req.body);
  try {
    await newpost.save();
    res.send({ msg: "new post has been created" });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { authorId } = req.body;
  const post = await PostModel.find({ authorId });

  if (!post) {
    return res.status(400).send({ msg: "Post not found for this user" });
  }
  await PostModel.findByIdAndUpdate(id, req.body);
  res.send({ msg: "Post has been updated" });
});

postRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { authorId } = req.body;
  const post = await PostModel.find({ authorId });

  if (!post) {
    return res.status(400).send({ msg: "Post not found for this user" });
  }
  await PostModel.findByIdAndDelete(id);
  res.send({ msg: "Post has been deleted" });
});

postRouter.get("/filter", async (req, res) => {
  let { device1, device2 } = req.query;

  if (device1 && device2) {
    let userdata = await PostModel.find({
      $or: [{ device: device1 }, { device: device2 }],
    });
    res.send(userdata);
  } else if (device1) {
    let userdata = await PostModel.find({ device: device1 });
    res.send(userdata);
  } else if (device2) {
    let userdata = await PostModel.find({ device: device2 });
    res.send(userdata);
  } else {
    let userdata = await PostModel.find();
    res.send(userdata);
  }
});

module.exports = { postRouter };

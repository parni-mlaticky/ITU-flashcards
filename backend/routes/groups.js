const express = require("express");
const router = express.Router();
const constants = require("../constants");
const Flash

router.get("/", async (req, res) => {
  try {
    const groups = await groupModel.getAll();
    res.status(200).json(groups);
  } catch (err) {
    console.log(err);
    const message = "Error getting groups";
    res.status(500, message);
  }
});

router.post("/", async (req, res) => {
  try {
    const group = await groupModel.create(req.body);
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    const message = "Error creating group";
    res.status(500, message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const group = await groupModel.getById(req.params.id);
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    const message = "Error getting group";
    res.status(500, message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const group = await groupModel.update(req.params.id, req.body);
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    const message = "Error updating group";
    res.status(500, message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const group = await groupModel.delete(req.params.id);
    res.status(200, "Group deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting group";
    res.status(500, message);
  }
});

router.get("/:id/chat", async (req, res) => {
  try {
    const chat = await groupModel.getChat(req.params.id);
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    const message = "Error getting chat";
    res.status(500, message);
  }
});

router.post("/:id/chat", async (req, res) => {
  try {
    const chat = await groupModel.createChat(req.params.id, req.body);
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    const message = "Error creating chat";
    res.status(500, message);
  }
});

router.get("/:id/tests", async (req, res) => {
  try {
    const tests = await groupModel.getTests(req.params.id);
    res.status(200).json(tests);
  } catch (err) {
    console.log(err);
    const message = "Error getting tests";
    res.status(500, message);
  }
});

router.post("/:id/tests", async (req, res) => {
  try {
    const test = await groupModel.createTest(req.params.id, req.body);
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    const message = "Error creating test";
    res.status(500, message);
  }
});

router.get("/:id/tests/:testId", async (req, res) => {
  try {
    const test = await groupModel.getTest(req.params.id, req.params.testId);
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    const message = "Error getting test";
    res.status(500, message);
  }
});

router.put("/:id/tests/:testId", async (req, res) => {
  try {
    const test = await groupModel.updateTest(
      req.params.id,
      req.params.testId,
      req.body,
    );
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    const message = "Error updating test";
    res.status(500, message);
  }
});

router.delete("/:id/tests/:testId", async (req, res) => {
  try {
    const test = await groupModel.deleteTest(
      req.params.id,
      req.params.testId,
      req.body,
    );
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    const message = "Error deleting test";
    res.status(500, message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const constants = require("../constants");
const groupModel = require("../objects/LearningGroup");

// Get all learning groups
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

// Create new group 
router.post("/", async (req, res) => {
  try {
    const { name, description, lectorId } = req.body;
    const group = new groupModel(null, name, description, lectorId);
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    const message = "Error creating group";
    res.status(500, message);
  }
});

// Get detail of group
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

// Update group name or description
router.put("/:id", async (req, res) => {
  try {
    const group = await groupModel.getById(req.params.id);
    group.name = req.body.name;
    group.description = req.body.description;
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    const message = "Error updating group";
    res.status(500, message);
  }
});

// Delete group
router.delete("/:id", async (req, res) => {
  try {
    const group = await groupModel.getById(req.params.id);
    await group.delete();
    res.status(200, "Group deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting group";
    res.status(500, message);
  }
});

// Chat for all members of the group
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

// Post a message to group chat
router.post("/:id/chat", async (req, res) => {
  try {
    const group = await groupModel.getById(req.params.id);
    group.postMessage(req.body.message);
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

const express = require("express");
const router = express.Router();
const constants = require("../constants");
const groupModel = require("../objects/LearningGroup");
const wrapped = require("./errorWrapper");

// Get all learning groups
router.get("/", wrapped(async (req, res) => {
    const groups = await groupModel.getAll();
    res.status(200).json(groups);
}));

// Create new group 
router.post("/", wrapped(async (req, res) => {
    const { name, description, lectorId } = req.body;
    const group = new groupModel(null, name, description, lectorId);
    await group.save();
    res.status(200).json(group);
}));

// Get detail of group
router.get("/:id", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    res.status(200).json(group);
}));

// Update group name or description
router.put("/:id", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    group.name = req.body.name;
    group.description = req.body.description;
    await group.save();
    res.status(200).json(group);
}));

// Delete group
router.delete("/:id", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    await group.delete();
    res.status(200, "Group deleted successfully");
}));

// Chat for all members of the group
router.get("/:id/chat", wrapped(async (req, res) => {
    const chat = await groupModel.getChat(req.params.id);
    res.status(200).json(chat);
}));

// Post a message to group chat
router.post("/:id/chat", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    group.postMessage(req.body.message);
    res.status(200).json(chat);
}));

router.get("/:id/tests", wrapped(async (req, res) => {
    const tests = await groupModel.getTests(req.params.id);
    res.status(200).json(tests);
}));

router.post("/:id/tests", wrapped(async (req, res) => {
    const test = await groupModel.createTest(req.params.id, req.body);
    res.status(200).json(test);
}));

router.get("/:id/tests/:testId", wrapped(async (req, res) => {
    const test = await groupModel.getTest(req.params.id, req.params.testId);
    res.status(200).json(test);
}));

router.put("/:id/tests/:testId", wrapped(async (req, res) => {
    const test = await groupModel.updateTest(
      req.params.id,
      req.params.testId,
      req.body,
    );
    res.status(200).json(test);
}));

router.delete("/:id/tests/:testId", wrapped(async (req, res) => {
    const test = await groupModel.deleteTest(
      req.params.id,
      req.params.testId,
      req.body,
    );
    res.status(200).json(test);
}));

module.exports = router;

const express = require("express");
const router = express.Router();
const constants = require("../constants");
const groupModel = require("../objects/LearningGroup");
const testModel = require("../objects/Test");
const fullTextQuestionModel = require("../objects/FulltextQuestion");
const fullTextAnswerModel = require("../objects/FulltextAnswer");
const wrapped = require("./errorWrapper");

// Get all learning groups
router.get("/", wrapped(async (req, res) => {
    const groups = await groupModel.getAll();
    res.status(200).json(groups);
}));

// Create new group 
router.post("/", wrapped(async (req, res) => {
    const { name, description, lectorId } = req.body;
    const group = new groupModel({id: null, name, description, lector_id: lectorId});
    await group.save();
    res.status(200).json(group);
}));

// Get detail of group
router.get("/:id/members", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    const members = await group.getMembers();
    res.status(200).json(members);
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
    res.status(200, "Group deleted successfully").json(group);
}));

// Join a particular user to a particualr group
router.post("/:id/join", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    const members = await group.getMembers();
    let isMember = req.body.user_id == group.lector_id;
    for (let i = 0; i < members.length && !isMember; i++) {
        if (members[i].user_id == req.body.user_id) {
            isMember = true;
        }
    }
    if (isMember) {
        res.status(200).json("User is already a member of this group.");
    }
    else {
        await group.addUser(req.body.user_id);
        res.status(200).json(group);
    }
}));

// Remove a particular user's group membership from a particular group
router.post("/:id/leave", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    await group.removeUser(req.body.user_id);
    res.status(200, "User removed from group succesfully.").json({status: "ok"});
}));

// Chat for all members of the group
router.get("/:id/chat", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    const chat = await group.getChat();
    res.status(200).json(chat);
}));

// Post a message to group chat
router.post("/:id/chat", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    await groupModel.postMessage(group.id, req.body.user_id, req.body.text);
    res.status(200).json();
}));

router.get("/:id/tests", wrapped(async (req, res) => {
    const group = await groupModel.getById(req.params.id);
    const tests = await group.getTests(req.query.user_id);
    res.status(200).json(tests);
}));

router.post("/:id/tests", wrapped(async (req, res) => {
    req.body.group_id = req.params.id;
    const test = new testModel(req.body);
    const response = await test.save()
    res.status(200).json(response);
}));

router.get("/:id/tests/:testId", wrapped(async (req, res) => {
    const test = await testModel.getById(req.params.testId);
    res.status(200).json(test);
}));

router.get("/:id/tests/:testId/all", wrapped( async (req, res) => {
    const users = await testModel.getUsersWhoAnsweredByTestId(req.params.testId);
    res.status(200).json(users);
}));

router.get("/:id/tests/:testId/fulltext", wrapped(async (req, res) => {
    const questions = await fullTextQuestionModel.getByTestId(req.params.testId);
    res.status(200).json(questions);
}));

router.post("/:id/tests/:testId/fulltext", wrapped(async (req, res) => {
    const question = new fullTextQuestionModel(req.body);
    const response = await question.save();
    res.status(200).json(response);
}));

router.get("/:id/tests/:testId/fulltext/:questionId", wrapped(async (req, res) => {
    const question = await fullTextQuestionModel.getById(req.params.questionId);
    res.status(200).json(question);
}));


router.delete("/:id/tests/:testId/fulltext/:questionId", wrapped(async (req, res) => {
    const question = await fullTextQuestionModel.getById(req.params.questionId);
    const result = await question?.delete();
    res.status(200).json(result);
}));

router.put("/:id/tests/:testId/fulltext/:questionId", wrapped(async (req, res) => {
    const question = new fullTextQuestionModel(req.body);
    const result = await question.save();
    res.status(200).json(result);
}));

// Posting on a question answers it
router.post("/:id/tests/:testId/fulltext/:questionId", wrapped(async (req, res) => {
    req.body.id = null;
    const answer = new fullTextAnswerModel(req.body);
    const result = await answer.save();
    res.status(200).json(result);
}));

router.get("/:groupId/tests/:testId/fulltext/answers/:userId", wrapped(async (req, res) => {
    const answers = await fullTextAnswerModel.getByTestIdAndUserId(req.params.testId, req.params.userId)
    res.status(200).json(answers);
}));


router.post("/:id/tests/:testId/options", wrapped(async (req, res) => {

    res.status(200).json(test);
}));

router.put("/:id/tests/:testId", wrapped(async (req, res) => {
    req.body.id = req.params.testId;
    req.body.group_id = req.params.id;
    const test = new testModel(req.body);
    const response = await test.save();
    res.status(200).json(response);
}));

router.delete("/:id/tests/:testId", wrapped(async (req, res) => {
    const test = await testModel.getById(req.params.testId);
    await test.delete()
    res.status(200).json(test);
}));

module.exports = router;

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const spaceModel = require("../models/spaceModel");
const editorModel = require("../models/editorModel");

const createSpace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { spaceName, spaceDescription, spaceEditorEmail } = req.body;
  try {
    const isSpaceExists = await spaceModel.findOne({ spaceName });
    if (isSpaceExists) {
      return res.status(400).json({ msg: "Space already exists" });
    }
    const editor = await editorModel.findOne({ email: spaceEditorEmail });
    if (!editor) {
      return res.status(400).json({ msg: "Editor not found" });
    }
    const newSpace = new spaceModel({
      spaceName,
      spaceDescription,
      editors: [editor._id],
      spaceAdmin: req.admin.id,
    });
    await newSpace.save();
    res.status(200).json({ newSpace, msg: "Space created successfully" });
  } catch (error) {
    console.error("Error in createSpace:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSpaces = async (req, res) => {
  try {
    const spaces = await spaceModel.find({ spaceAdmin: req.admin.id });
    res.status(200).json({ spaces });
  } catch (error) {
    console.error("Error in getSpaces:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const addEditor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { editorEmail, spaceId } = req.body;
  try {
    const editor = await editorModel.findOne({
      email: editorEmail,
    });
    if (!editor) {
      return res.status(400).json({ msg: "Editor not found" });
    }
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(400).json({ msg: "Space not found" });
    }
    if (space.editors.includes(editor._id)) {
      return res.status(400).json({ msg: "Editor already exists" });
    }
    space.editors.push(editor._id);
    await space.save();
    res.status(200).json({ msg: "Editor added successfully", space });
  } catch (error) {
    console.error("Error in addEditor:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const removeEditor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { editorEmail, spaceId } = req.body;
  try {
    const editor = await editorModel.findOne({ email: editorEmail });
    if (!editor) {
      return res.status(400).json({ msg: "Editor not found" });
    }
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(400).json({ msg: "Space not found" });
    }
    if (!space.editors.includes(editor._id)) {
      return res.status(400).json({ msg: "Editor not found" });
    }
    space.editors = space.editors.filter(
      (editorId) => editorId.toString() !== editor._id.toString()
    );
    await space.save();
    res.status(200).json({ msg: "Editor removed successfully", space });
  } catch (error) {
    console.error("Error in removeEditor:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getEditors = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { spaceId } = req.body;

  try {
    const space = await spaceModel.findById(spaceId).populate("editors");
    if (!space) {
      return res.status(400).json({ msg: "Space not found" });
    }
    res.status(200).json({ editors: space.editors });
  } catch (error) {
    console.error("Error in getEditors:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createSpace,
  addEditor,
  removeEditor,
  getSpaces,
  getEditors,
};

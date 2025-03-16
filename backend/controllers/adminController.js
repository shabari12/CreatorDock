const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const signupAdmin = async (req, res) => {

};
const loginAdmin = async (req, res) => {};


module.exports = { signupAdmin, loginAdmin };
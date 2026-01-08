const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');



const createPerson = async (req, res) => {
  const { name, email, details } = req.body;
  try {
    // Check if user exists
    let user = await Person.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create person
    user = new Person({ name, email, details });
    await user.save();
    res.status(201).json({success:true, user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Persons (with totals)
const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ name: 1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPersonById = async (req, res) => {

  try {
    const { id } = req.params;
    const personId = new mongoose.Types.ObjectId(id);
    const person = await Person.findById(personId);

    if (!person) {
      return res.status(404).json({
        success: false,
        message: 'Person not found',
      });
    }

    res.status(200).json({
      success: true,
      person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createPerson, getAllPersons, getPersonById };
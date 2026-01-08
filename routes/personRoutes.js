const express = require('express');
const { createPerson, getAllPersons, getPersonById } = require('../controllers/personController');

const router = express.Router();
//person routes
router.post('/create', createPerson);
router.get('/getAll', getAllPersons);
router.get('/getById/:id', getPersonById);


module.exports = router;
var express = require('express');
var router = express.Router();

// Require controller modules.
var category_controller = require('../controllers/categoryController');
var computerpart_controller = require('../controllers/computerpartController');
var manufacturer_controller = require('../controllers/manufacturerController');

/* GET home page. */
router.get('/', category_controller.index);

module.exports = router;
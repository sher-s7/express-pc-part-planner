var Manufacturer = require('../models/manufacturer');
var async = require("async");
var mongoose = require("mongoose");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody, sanitize } = require("express-validator/filter");

// Display list of all Manufacturers.
exports.manufacturer_list = function(req, res, next) {
    Manufacturer.find().exec(function(err, list_manufacturers) {
        if(err) return next(err);

        res.render('manufacturer_list', {
            title: 'All Manufacturers',
            manufacturers: list_manufacturers
        })
    })
};

// Display detail page for a specific Manufacturer.
exports.manufacturer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer detail: ' + req.params.id);
};

// Display Manufacturer create form on GET.
exports.manufacturer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer create GET');
};

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer create POST');
};

// Display Manufacturer delete form on GET.
exports.manufacturer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer delete GET');
};

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer delete POST');
};

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer update GET');
};

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer update POST');
};

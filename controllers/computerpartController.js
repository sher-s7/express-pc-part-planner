var ComputerPart = require("../models/computerpart");
var Category = require("../models/category");
var async = require("async");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody, sanitize } = require("express-validator/filter");

// Display list of all ComputerParts.
exports.computerpart_list = function (req, res, next) {
  ComputerPart.find().exec(function (err, list_computerparts) {
    if (err) next(err);

    res.render("component_list", {
      title: "All Computer Parts",
      component_list: list_computerparts,
    });
  });
};

// Display detail page for a specific ComputerPart.
exports.computerpart_detail = function (req, res, next) {
  ComputerPart.findById(req.params.id)
    .populate("category")
    .populate("manufacturer")
    .exec(function (err, component) {
      if (err) next(err);

      res.render("component_detail", {
        title: component.name,
        component: component,
        category: component.category,
        manufacturer: component.manufacturer,
      });
    });
};

// Display ComputerPart create form on GET.
exports.computerpart_create_get = function (req, res) {
  res.render("component_form", {
    title: "Create a computer part",
  });
};

// Handle ComputerPart create on POST.
exports.computerpart_create_post = [
  body("name", "Name must be at least 3 characters in length")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description").trim().escape(),
  body("inStock", "Must be a value of 0 or more").isNumeric(),
  body("price", "Must be between $0 and $999999").isFloat(),
  body("category", "Category must not be empty").trim().escape(),
  body("manufacturer", "Manufacturer must not be empty").trim().escape(),
];

// Display ComputerPart delete form on GET.
exports.computerpart_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: ComputerPart delete GET");
};

// Handle ComputerPart delete on POST.
exports.computerpart_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: ComputerPart delete POST");
};

// Display ComputerPart update form on GET.
exports.computerpart_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: ComputerPart update GET");
};

// Handle ComputerPart update on POST.
exports.computerpart_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: ComputerPart update POST");
};

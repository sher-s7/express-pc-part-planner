var Manufacturer = require("../models/manufacturer");
var ComputerPart = require("../models/computerpart");
var async = require("async");
var mongoose = require("mongoose");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody, sanitize } = require("express-validator/filter");

// Display list of all Manufacturers.
exports.manufacturer_list = function (req, res, next) {
  Manufacturer.find().exec(function (err, list_manufacturers) {
    if (err) return next(err);

    res.render("manufacturer_list", {
      title: "All Manufacturers",
      manufacturers: list_manufacturers,
    });
  });
};

// Display detail page for a specific Manufacturer.
exports.manufacturer_detail = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturer_parts: function (callback) {
        ComputerPart.find({ manufacturer: req.params.id })
          .populate("category")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.manufacturer == null) {
        let err = new Error("Manufacturer not found");
        err.status - 404;
        return next(err);
      }
      res.render("manufacturer_detail", {
        title: results.manufacturer.name,
        manufacturer: results.manufacturer,
        manufacturer_parts: results.manufacturer_parts,
      });
    }
  );
};

// Display Manufacturer create form on GET.
exports.manufacturer_create_get = function (req, res) {
  res.render("manufacturer_form", { title: "Add a manufacturer" });
};

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer name must be specified."),
  body("description").optional({ checkFalsy: true }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("manufacturer_form", {
        title: "Add a manufacturer",
        manufacturer: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      var manufacturer = new Manufacturer({
        name: req.body.name,
        description: req.body.description,
      });

      manufacturer.save(function (err) {
        if (err) return next(err);

        res.redirect(manufacturer.url);
      });
    }
  },
];

// Display Manufacturer delete form on GET.
exports.manufacturer_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Manufacturer delete GET");
};

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Manufacturer delete POST");
};

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Manufacturer update GET");
};

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Manufacturer update POST");
};

var ComputerPart = require("../models/computerpart");
var Category = require("../models/category");
var Manufacturer = require("../models/manufacturer");
var async = require("async");
var mongoose = require("mongoose");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody, sanitize } = require("express-validator/filter");

// Display list of all ComputerParts.
exports.computerpart_list = function (req, res, next) {
  ComputerPart.find()
    .populate("manufacturer")
    .populate("category")
    .exec(function (err, list_computerparts) {
      if (err) next(err);

      res.render("component_list", {
        title: "All Computer Parts",
        component_list: list_computerparts,
      });
    });
};

// Display detail page for a specific ComputerPart.
exports.computerpart_detail = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  ComputerPart.findById(req.params.id)
    .populate("category")
    .populate("manufacturer")
    .exec(function (err, component) {
      if (err) next(err);

      if (component == null) {
        let err = new Error("Component not found");
        err.status - 404;
        return next(err);
      }

      res.render("component_detail", {
        title: component.name,
        component: component,
        category: component.category,
        manufacturer: component.manufacturer,
      });
    });
};

// Display ComputerPart create form on GET.
exports.computerpart_create_get = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().exec(callback);
      },
      manufacturers: function (callback) {
        Manufacturer.find().exec(callback);
      },
    },
    function (err, results) {
      if (err) next(err);

      res.render("component_form", {
        title: "Create a computer part",
        categories: results.categories,
        manufacturers: results.manufacturers,
      });
    }
  );
};

// Handle ComputerPart create on POST.
exports.computerpart_create_post = [
  body("name", "Name must be at least 3 characters in length")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description").trim().escape(),
  body("inStock", "Stock cannot be lower than 0").isInt({ min: 0, max: 9999 }),
  body("price", "Price must be between $0 and $999999").isFloat({
    min: 0,
    max: 999999,
  }),
  body("category", "Category must not be empty").trim().escape(),
  body("manufacturer", "Manufacturer must not be empty").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var component = new ComputerPart({
      name: req.body.name,
      description: req.body.description,
      inStock: req.body.inStock,
      price: req.body.price,
      category: req.body.category,
      manufacturer: req.body.manufacturer,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: function (callback) {
            Category.find().exec(callback);
          },
          manufacturers: function (callback) {
            Manufacturer.find().exec(callback);
          },
        },
        function (err, results) {
          if (err) next(err);

          res.render("component_form", {
            title: "Create a computer part",
            categories: results.categories,
            manufacturers: results.manufacturers,
            component: component,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      component.save(function (err) {
        if (err) return next(err);
        res.redirect(component.url);
      });
    }
  },
];

// Display ComputerPart delete form on GET.
exports.computerpart_delete_get = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  ComputerPart.findById(req.params.id)
    .populate("category")
    .populate("manufacturer")
    .exec(function (err, component) {
      if (err) next(err);

      if (component == null) {
        let err = new Error("Component not found");
        err.status - 404;
        return next(err);
      }

      res.render("component_delete", {
        title: "Delete Component: " + component.name,
        component: component,
        category: component.category,
        manufacturer: component.manufacturer,
      });
    });
};

// Handle ComputerPart delete on POST.
exports.computerpart_delete_post = function (req, res, next) {
  ComputerPart.findByIdAndRemove(req.body.id, function deleteComponent(err) {
    if (err) return next(err);

    res.redirect("/components");
  });
};

// Display ComputerPart update form on GET.
exports.computerpart_update_get = function (req, res) {
  ComputerPart.findById(req.params.id, function (err, component) {
    if (err) return next(err);
  });
};

// Handle ComputerPart update on POST.
exports.computerpart_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: ComputerPart update POST");
};

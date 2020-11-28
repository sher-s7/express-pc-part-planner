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
          .populate("manufacturer")
          .populate("category")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.manufacturer == null) {
        let err = new Error("Manufacturer not found");
        err.status = 404;
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
  res.render("manufacturer_form", { title: "Add a manufacturer", isUpdating: false });
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
        isUpdating: false,
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
exports.manufacturer_delete_get = function (req, res, next) {
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
        ComputerPart.find({ manufacturer: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.manufacturer == null) {
        const err = new Error("Manufacturer not found");
        err.status = 404;
        return next(err);
      }

      res.render("manufacturer_delete", {
        title: "Delete Manufacturer: " + results.manufacturer.name,
        manufacturer: results.manufacturer,
        manufacturer_parts: results.manufacturer_parts,
      });
    }
  );
};

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = function (req, res, next) {
  if (req.body.password != process.env.ADMIN_PASSWORD) {
    let err = new Error("The password you entered is incorrect.");
    err.status = 401;
    return next(err);
  } else {
    async.parallel(
      {
        manufacturer: function (callback) {
          Manufacturer.findById(req.params.id).exec(callback);
        },
        manufacturer_parts: function (callback) {
          ComputerPart.find({ manufacturer: req.params.id }).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);

        if (results.manufacturer_parts.length > 0) {
          res.render("manufacturer_delete", {
            title: "Delete Manufacturer: " + results.manufacturer.name,
            manufacturer: results.manufacturer,
            manufacturer_parts: results.manufacturer_parts,
          });
          return;
        } else {
          Manufacturer.findByIdAndRemove(
            req.body.id,
            function deleteManufacturer(err) {
              if (err) return next(err);

              res.redirect("/manufacturers");
            }
          );
        }
      }
    );
  }
};

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  Manufacturer.findById(req.params.id, function (err, manufacturer) {
    if (err) return next(err);

    if (manufacturer == null) {
      const err = new Error("Manufacturer not found");
      err.status = 404;
      return next(err);
    }

    res.render("manufacturer_form", {
      title: "Update " + manufacturer.name,
      isUpdating: true,
      manufacturer: manufacturer,
    });
  });
};

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer name must be specified."),
  body("description").optional({ checkFalsy: true }),
  (req, res, next) => {
    if (req.body.password != process.env.ADMIN_PASSWORD) {
      let err = new Error("The password you entered is incorrect.");
      err.status = 401;
      return next(err);
    } else {
      const errors = validationResult(req);

      var manufacturer = new Manufacturer({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.render("manufacturer_form", {
          title: "Update Manufacturer",
          manufacturer: manufacturer,
          isUpdating: true,
          errors: errors.array(),
        });
        return;
      } else {
        Manufacturer.findByIdAndUpdate(
          req.params.id,
          manufacturer,
          {},
          function (err, themanufacturer) {
            if (err) return next(err);

            res.redirect(themanufacturer.url);
          }
        );
      }
    }
  },
];

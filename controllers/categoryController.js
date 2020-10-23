var Category = require("../models/category");
var ComputerPart = require("../models/computerpart");
var async = require("async");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody, sanitize } = require("express-validator/filter");

// Display list of all Categorys.
exports.category_list = function (req, res, next) {
  Category.find().exec(function (err, list_categories) {
    if (err) return next(err);

    res.render("category_list", {
      title: "All Categories",
      category_list: list_categories,
    });
  });
};

// Display detail page for a specific Category.
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_parts: function (callback) {
        ComputerPart.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category == null) {
        var err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail", {
        title: results.category.title + " - PC Part Planner",
        category: results.category,
        category_parts: results.category_parts,
      });
    }
  );
};

// Display Category create form on GET.
exports.category_create_get = function (req, res, next) {
  res.render("category_form", { title: "Create category" });
};

// Handle Category create on POST.
exports.category_create_post = [
  body("title")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category name must be specified")
    .isAlphanumeric()
    .withMessage("Title has non-alphanumeric characters."),
  body("description").optional({ checkFalsy: true }),

  sanitize("title").escape(),
  sanitize("description").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Create a Category object with escaped and trimmed data.
      var category = new Category({
        title: req.body.title,
        description: req.body.description,
      });
      category.save(function (err) {
        if (err) return next(err);
        res.redirect(category.url);
      });
    }
  },
];

// Display Category delete form on GET.
exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_parts: function (callback) {
        ComputerPart.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.category == null) {
        res.redirect("/categories");
      }

      res.render("category_delete", {
        title: "Delete Category: " + results.category.title,
        category: results.category,
        category_parts: results.category_parts,
      });
    }
  );
};

// Handle Category delete on POST.
exports.category_delete_post = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_parts: function (callback) {
        ComputerPart.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.category_parts.length > 0) {
        res.render("category_delete", {
          title: "Delete Category: " + results.category.title,
          category: results.category,
          category_parts: results.category_parts,
        });
        return;
      } else {
        Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(
          err
        ) {
          if (err) return next(err);

          res.redirect("/categories");
        });
      }
    }
  );
};

// Display Category update form on GET.
exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id, function (err, category) {
    if (err) return next(err);

    if (category == null) {
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    //Success
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  });
};

// Handle Category update on POST.
exports.category_update_post = [
  body("title")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category name must be specified")
    .isAlphanumeric()
    .withMessage("Title has non-alphanumeric characters."),
  body("description").optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);

    var category = new Category({
      title: req.body.title,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findByIdAndUpdate(req.params.id, category, {}, function (
        err,
        thecategory
      ) {
        if (err) return next(err);

        res.redirect(thecategory.url);
      });
    }
  },
];

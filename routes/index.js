var express = require("express");
var router = express.Router();

var async = require("async");

var Category = require("../models/category");
var ComputerPart = require("../models/computerpart");
var Manufacturer = require("../models/manufacturer");

// Require controller modules.
var category_controller = require("../controllers/categoryController");
var computerpart_controller = require("../controllers/computerpartController");
var manufacturer_controller = require("../controllers/manufacturerController");

/* GET home page. */
router.get("/", function (req, res) {
  res.redirect("list");
});

router.get("/list", function (req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    console.log('hello')
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
    localStorage.setItem("userList", JSON.stringify({ cpu: "none" }));
  }
  res.render("list", {
    userList: localStorage.getItem("userList"),
  });
});

module.exports = router;

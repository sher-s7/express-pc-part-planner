#! /usr/bin/env node

console.log(
  "This script populates some test components, manufacturers, and categories to the pc_part_planner database."
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Category = require("./models/category");
var ComputerPart = require("./models/computerpart");
var Manufacturer = require("./models/manufacturer");

var mongoose = require("mongoose");
const manufacturer = require("./models/manufacturer");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var computerparts = [];
var manufacturers = [];

function categoryCreate(title, description, cb) {
  categorydetail = { title: title };
  if (description != false) categorydetail.description = description;

  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function manufacturerCreate(name, description, cb) {
  manufacturerdetail = { name: name };
  if (description != false) manufacturerdetail.description = description;

  var manufacturer = new Manufacturer(manufacturerdetail);

  manufacturer.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Manufacturer: " + manufacturer);
    manufacturers.push(manufacturer);
    cb(null, manufacturer);
  });
}

function computerPartCreate(
  name,
  description,
  inStock,
  price,
  category,
  manufacturer,
  cb
) {
  var computerPart = new ComputerPart({
    name: name,
    description: description,
    inStock: inStock,
    price: price,
    category: category,
    manufacturer: manufacturer,
  });

  computerPart.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Computer part: " + computerPart);
    computerparts.push(computerPart);
    cb(null, computerPart);
  });
}

// Create categories, manufacturers and parts

function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate(
          "CPU",
          "A Central Processing Unit (CPU) is the brain of the computer. This is what runs all your programs, calculations, and operations.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "CPU Cooler",
          "A heatsink and fan (HSF), also known as a CPU Cooler, sits atop the CPU to draw heat away from the CPU and disperse it, because CPUs produce heat while operating. Most CPUs will come with a free “stock” HSF, but if you buy a CPU that comes without a cooler and/or if you plan to overclock your CPU, you will need to buy an “aftermarket” HSF.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Motherboard",
          "The motherboard electronically connects all of your PC’s parts. It also takes power from the PSU and provides it to many of your other components.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createManufacturers(cb) {
  async.parallel(
    [
      function (callback) {
        manufacturerCreate(
          "NVIDIA",
          "NVIDIA, inventor of the GPU, which creates interactive graphics on laptops, workstations, mobile devices, notebooks, PCs, and more. NVIDIA created the world’s largest gaming platform and the world’s fastest supercomputer. They are the brains of self-driving cars, intelligent machines, and IoT.",
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Intel",
          "Intel's innovation in cloud computing, data center, Internet of Things, and PC solutions is powering the smart and connected digital world we live in.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createComponents(cb) {
  async.parallel(
    [
      function (callback) {
        computerPartCreate(
          "Intel® Core™ i7-9700K Processor",
          "The Core i7-9700k 3.6 GHz 8 Core Processor from Intel is designed for gaming, creating, and productivity.",
          9,
          429.99,
          categories[0],
          manufacturers[1],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createManufacturers, createComponents],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Components: " + computerparts);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

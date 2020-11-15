var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: { type: String, required: true, maxlength: 30 },
  description: { type: String, maxlength: 500 },
});

//Virtual for manufacturer's URL
CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

//Export model
module.exports = mongoose.model("Category", CategorySchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SseSchema = new Schema({
  sseId: { type: String },
});

module.exports = mongoose.model("Sse", SseSchema);

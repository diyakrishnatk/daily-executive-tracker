const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    executive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    dealerName: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    activity: {
      type: String,
      required: true,
      trim: true
    },

    cases: {
      type: Number,
      default: 0,
      min: 0
    },

    salesAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    collectionAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    remarks: {
      type: String,
      trim: true
    },

    nextFollowUp: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Activity", activitySchema);
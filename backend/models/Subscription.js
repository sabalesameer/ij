const mongoose = require("mongoose");

// Define schema for subscription plans
const subscriptionSchema = new mongoose.Schema(
  {
    plan_type: {
      type: String,
      required: true,
      unique: true, // Ensure plan_type is unique (e.g., only one 'free' plan exists)
      enum: ["free", "standard", "professional", "enterprise"]
    },
    price_per_user_month: {
      type: Number,
      default: 0
    },
    active_jobs_limit: {
      type: Number,
      default: 0
    },
    client_user_limit: {
      type: Number,
      default: 0
    },
    recruiter_user_limit: {
      type: Number,
      default: 0
    },
    vendor_user_limit: {
      type: Number,
      default: 0
    },
    HR_user_limit: {
      type: Number,
      default: 0
    },
    features: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = {
  SubscriptionModel,
  subscriptionSchema
};

// File: backend/seedSubscriptions.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { SubscriptionModel } = require("../backend/models/Subscription"); // ✅ Import MODEL, not schema

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const subscriptions = [
  {
    plan_type: "free",
    price_per_user_month: 0,
    active_jobs_limit: 1,
    client_user_limit: 1,
    vendor_user_limit: 1,
    HR_user_limit: 1,
    recruiter_user_limit: 2,
    features: [
      "Candidate Management",
      "Email Management",
      "Interview Scheduling",
      "8/5 support"
    ]
  },
  {
    plan_type: "standard",
    price_per_user_month: 1250,
    active_jobs_limit: 100,
    client_user_limit: 3,
    recruiter_user_limit: 5,
    vendor_user_limit: 2,
    HR_user_limit: 2,
    features: [
      "Everything in FREE",
      "Candidate Sourcing",
      "Premium Job Boards",
      "Social Recruiting",
      "Resume Management",
      "Applicant Tracking",
      "Talent Pipeline",
      "Standard Reports & Dashboards",
      "50+ Integrations"
    ]
  },
  {
    plan_type: "professional",
    price_per_user_month: 2500,
    active_jobs_limit: 250,
    client_user_limit: 5,
    recruiter_user_limit: 10,
    vendor_user_limit: 3,
    HR_user_limit: 3,
    features: [
      "Everything in STANDARD",
      "AI Candidate Matching",
      "Advanced Analytics",
      "Custom Reports & Dashboards",
      "Candidate Portals",
      "Screening & Assessments",
      "Advanced Security Control",
      "Assignment Rules",
      "SMS & Phonebridge"
    ]
  },
  {
    plan_type: "enterprise",
    price_per_user_month: 3750,
    active_jobs_limit: 750,
    client_user_limit: 10,
    recruiter_user_limit: 20,
    vendor_user_limit: 10,
    HR_user_limit: 10,
    features: [
      "Everything in PROFESSIONAL",
      "Custom Roles & Profiles",
      "Custom Functions & Buttons",
      "Client Portals",
      "Staffing Portals",
      "Layout Rules",
      "Web Tabs",
      "Blueprint",
      "Territory Management",
      "Advanced Assignment Rules",
      "Auto Responders",
      "Google Meet Integration",
      "Microsoft Teams Integration"
    ]
  }
];

const seed = async () => {
  try {
    await SubscriptionModel.deleteMany({});
    console.log("🗑️ Existing subscription plans cleared.");
    await SubscriptionModel.insertMany(subscriptions);
    console.log("✅ Subscription plans seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();

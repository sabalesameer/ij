// File: backend/controller/clientController.js
const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const { SubscriptionModel } = require("../models/Subscription");

// Generate JWT Token
const generateToken = (client) => {
  return jwt.sign(
    {
      id: client._id,
      company_name: client.company_name,
      email: client.contact_email,
      role: "client"
    },
    process.env.JWT_KEY,
    { expiresIn: "20d" }
  );
};
// ✅ Register Client with Free Trial Plan
exports.registerClient = async (req, res) => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14-day free trial

    const newClient = new Client({
      ...req.body,
      subscription: {
        plan_type: "free",
        start_date: new Date(),
        end_date: endDate,
        client_user_limit: 2,
        recruiter_user_limit: 3,
        current_client_users: 1,
        current_recruiter_users: 0,
        status: "active"
      }
    });

    await newClient.save();

    res.status(201).json({ success: true, client: newClient });
  } catch (err) {
    console.error("Client Registration Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ✅ Login Client
exports.loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ contact_email: email });

    if (!client) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await client.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (client.account_status !== "active") {
      return res.status(403).json({ message: "Account is not active" });
    }

    const token = generateToken(client);

    res.status(200).json({
      message: "Login successful",
      token,
      client: {
        id: client._id,
        company_name: client.company_name,
        email: client.contact_email,
        subscription: client.subscription,
        account_status: client.account_status
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Subscribe Client to a Plan
// file: backend/controller/clientController.js
exports.subscribeClient = async (req, res) => {
  const { plan_type, duration_days } = req.body;
  const clientId = req.params.id;

  try {
    if (!plan_type) {
      return res.status(400).json({ message: "Plan type is required" });
    }

    const selectedPlan = await SubscriptionModel.findOne({ plan_type: plan_type.toLowerCase() });
    if (!selectedPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (duration_days || 30));

    client.subscription = {
      plan_type: selectedPlan.plan_type,
      start_date: startDate,
      end_date: endDate,
      status: "active",
      features: selectedPlan.features,

      // Limits
      client_user_limit: selectedPlan.client_user_limit,
      recruiter_user_limit: selectedPlan.recruiter_user_limit,
      vendor_user_limit: selectedPlan.vendor_user_limit,
      HR_user_limit: selectedPlan.HR_user_limit,

      // Counters
      current_client_users: 0,
      current_recruiter_users: 0,
      current_vendor_users: 0,
      current_hr_users: 0
    };

    const updatedClient = await client.save();

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedClient.subscription
    });

  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

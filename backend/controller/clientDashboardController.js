// File: backend/controller/clientDashboardController.js
const Client = require("../models/Client");
const UserAccount = require("../models/UserAccount");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const { SubscriptionModel } = require("../models/Subscription");

exports.createUserUnderClient = async (req, res) => {
  const { clientId } = req.params;
  const { role, username, password, email } = req.body;

  try {
    if (!role || !username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { subscription } = client;
    if (!subscription || !subscription.plan_type) {
      return res.status(400).json({ message: "Client has no active subscription" });
    }

    const planDetails = await SubscriptionModel.findOne({ plan_type: subscription.plan_type.toLowerCase() });
    if (!planDetails) {
      return res.status(500).json({ message: "Subscription plan details not found" });
    }

    const validRoles = ["client_user", "recruiter", "vendor", "hr"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${validRoles.join(", ")}` });
    }

    const roleKeyMap = {
      client_user: "client_user_limit",
      recruiter: "recruiter_user_limit",
      vendor: "vendor_user_limit",
      hr: "HR_user_limit"
    };

    const currentKeyMap = {
      client_user: "current_client_users",
      recruiter: "current_recruiter_users",
      vendor: "current_vendor_users",
      hr: "current_hr_users"
    };

    const roleKey = roleKeyMap[role];
    const currentKey = currentKeyMap[role];

    const allowed = planDetails[roleKey] || 0;
    const current = subscription[currentKey] || 0;

    console.log(`Checking role: ${role}, Allowed: ${allowed}, Current: ${current}`);

    if (current >= allowed) {
      return res.status(403).json({
        message: `Cannot create more ${role} users. Limit of ${allowed} reached.`,
        currentUsers: current,
        limit: allowed
      });
    }

    const existingUser = await UserAccount.findOne({
      $or: [
        { username },
        { email }
      ]
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists. Please choose a different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAccount({
      client: clientId,
      role,
      username,
      password: hashedPassword,
      email
    });
    await newUser.save();

    await sendEmail({
      to: email,
      subject: "Your Account Login - JobSakura",
      html: `
        <p>Hello,</p>
        <p>Your JobSakura login credentials:</p>
        <ul>
          <li><b>Username:</b> ${username}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>Please change your password after first login.</p>
      `
    });

    subscription[currentKey] = current + 1;
    client.markModified("subscription");
    await client.save();

    res.status(201).json({
      message: `${role} user created successfully.`,
      currentUsers: subscription[currentKey],
      limit: allowed
    });

  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

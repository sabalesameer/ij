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
    // Validate input
    if (!role || !username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validRoles = ["client_user", "recruiter", "vendor", "hr"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles: ${validRoles.join(", ")}` });
    }

    // Find client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { subscription } = client;
    if (!subscription || !subscription.plan_type) {
      return res.status(400).json({ message: "Client has no active subscription" });
    }

    // Fetch subscription plan details
    const planDetails = await SubscriptionModel.findOne({
      plan_type: subscription.plan_type.toLowerCase()
    });

    if (!planDetails) {
      return res.status(500).json({ message: "Subscription plan not found" });
    }

    // Map role → limit field in subscription plan
    const roleKeyMap = {
      client_user: "client_user_limit",
      recruiter: "recruiter_user_limit",
      vendor: "vendor_user_limit",
      hr: "HR_user_limit"
    };

    const limit = planDetails[roleKeyMap[role]] || 0;

    // Count how many users already exist in DB under this client and role
    const existingCount = await UserAccount.countDocuments({
      client: clientId,
      role: role
    });

    if (existingCount >= limit) {
      return res.status(403).json({
        message: `Cannot create more '${role}' users. Limit of ${limit} reached.`,
        currentUsers: existingCount,
        limit
      });
    }

    // Ensure username/email is unique
    const existingUser = await UserAccount.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists."
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAccount({
      client: clientId,
      role,
      username,
      password: hashedPassword,
      email
    });

    await newUser.save();

    // Send email
    await sendEmail({
      to: email,
      subject: "Your JobSakura Login Credentials",
      html: `
        <p>Hello,</p>
        <p>Your JobSakura login credentials:</p>
        <ul>
          <li><b>Username:</b> ${username}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>Please change your password after your first login.</p>
      `
    });

    return res.status(201).json({
      message: `${role} user created successfully.`,
      currentUsers: existingCount + 1,
      limit
    });

  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.assignTeamLeadRecruiter = async (req, res) => {
  const { clientId, recruiterId } = req.params;

  try {
    // Ensure recruiter exists and belongs to this client
    const recruiter = await UserAccount.findOne({
      _id: recruiterId,
      client: clientId,
      role: "recruiter"
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found for this client." });
    }

    // Set isTeamLead = false for all other recruiters under this client
    await UserAccount.updateMany(
      { client: clientId, role: "recruiter" },
      { $set: { isTeamLead: false } }
    );

    // Set isTeamLead = true for selected recruiter
    recruiter.isTeamLead = true;
    await recruiter.save();

    res.status(200).json({ message: "Team Lead assigned successfully." });
  } catch (error) {
    console.error("Assign team lead error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getClientUsers = async (req, res) => {
  const { clientId } = req.params;

  try {
    // ✅ Query users linked to the client
    const users = await UserAccount.find({ client: clientId })  .populate("client", "name"); // shows client name only

    // ❗ Handle empty result
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found for this client." });
    }

    // ✅ Return users
    res.status(200).json(users);
  } catch (error) {
    console.error("Get client users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

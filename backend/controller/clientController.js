const Client = require("../models/Client");
const jwt = require('jsonwebtoken');


exports.registerClient = async (req, res) => {
try {
const newClient = new Client(req.body);
await newClient.save();
res.status(201).json({ success: true, client: newClient });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};

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
    { expiresIn: '20d' }
  );
};

// loginClient function to authenticate client
exports.loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ contact_email: email });

    if (!client) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await client.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // check account status
    if (client.account_status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // respond with token
    const token = generateToken(client);

    res.status(200).json({
      message: 'Login successful',
      token,
      client: {
        id: client._id,
        company_name: client.company_name,
        email: client.contact_email,
        account_status: client.account_status
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
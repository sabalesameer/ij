const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (employee) => {
  return jwt.sign(
    {
      id: employee._id,
      email: employee.email,
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: "employee"
    },
    process.env.JWT_KEY,
    { expiresIn: "20d" }
  );
};

// Register New Employee
exports.registerEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Existing Employee
exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (employee.account_status !== "active") {
      return res.status(403).json({ message: "Account is not active" });
    }

    const token = generateToken(employee);

    res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

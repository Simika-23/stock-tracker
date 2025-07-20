const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Minimal Joi schema for basic validation
const userValidationSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Register user
const createUser = async (req, res) => {
  // Log only safe info, mask password
  console.log("Register request:", { 
    userName: req.body.userName, 
    email: req.body.email, 
    password: '********' 
  });
  
  try {
    // Validate input using Joi
    const { error, value } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Extract validated and sanitized values
    const userName = value.userName.trim();
    const email = value.email.trim();
    const password = value.password;

    // Check if username already exists
    const userExist = await User.findOne({ where: { username: userName } });
    if (userExist) {
      return res.status(409).json({ success: false, message: "Username already in use" });
    }

    // Check if email already exists
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (no image field)
    const newUser = await User.create({
      username: userName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      message: "User created successfully!"
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};


// Joi schema for validating login input
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Login user
const loginUser = async (req, res) => {
  // Log only safe info, mask password
  console.log("Login attempt:", { 
    email: req.body.email, 
    password: '********' 
  });

  try {
    // Validate request body using Joi
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Normalize email and get password
    const email = value.email.trim().toLowerCase();
    const password = value.password;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response with token and user info
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['username'] // You can add 'email' or other fields here if needed
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let updatedFields = { username, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    await User.update(updatedFields, { where: { id: userId } });

    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await User.destroy({ where: { id: userId } });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
const findUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email']
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  findUserById
};

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register user
const createUser = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File Path:", req.files?.length ? req.files[0].path : null);

    // JOI Validation
    try {
        const userName = req.body.userName?.trim();
        const email = req.body.email?.trim();
        const password = req.body.password;

        // Basic validation
        if (!userName || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        // Optional image upload handling
        const image = req.files?.length > 0 ? req.files[0].path : null;

        // Check for existing username
        const userExist = await User.findOne({ where: { username: userName } });
        if (userExist) {
            return res.status(409).json({ success: false, message: "Username already in use" });
        }

        // Check for existing email
        const emailExist = await User.findOne({ where: { email: email } });
        if (emailExist) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        // Password encryption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            username: userName,
            email,
            password: hashedPassword, //first ko db ko ho and second user input.
            image,
        });

        return res.status(201).json({
            success: true,
            user: newUser,
            message: "User created successfully!",
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    console.log("Login Request:", req.body);
    
    try {
        const email = req.body.email?.trim();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

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
            message: "Server error. Please try again later.",
            error: error.message
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

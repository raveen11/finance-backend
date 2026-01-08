const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,     // ❗ false for localhost (NO HTTPS)
      sameSite: 'lax',   // works for localhost
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log('ABCD----dd',res.cookie);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const logoutUser = async (req, res) => {
  try {
      res.clearCookie('authToken', {
        httpOnly: true,
        // Match these settings exactly as in your login function:
        secure: false,     // ❗ Must be false to work on localhost/HTTP
        sameSite: 'lax',   // Must match 'lax'
        // maxAge is not needed for clearing, but path is often helpful
        path: '/',
      });

      // Send a response back to the client
      res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser,logoutUser };
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register user
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ email, password });

    // Create verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Verify your email",
      html: `<p>Click <a href="${process.env.BASE_URL}/api/auth/verify/${verificationToken}">here</a> to verify your email.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered! Check your email to verify your account."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");

    user.isVerified = true;
    await user.save();

    res.send("Email verified! You can now login.");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

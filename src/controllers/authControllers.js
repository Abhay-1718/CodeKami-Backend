import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";
import { asyncHandler } from '../middlewares/asyncHandler.js';

const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to CodeKami",
      text: `Welcome to Codekami website. Your account has been created with email id : ${email}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
};

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing details",
    });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User Already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new userModel({ 
    firstName, 
    lastName, 
    email, 
    password: hashedPassword 
  });
  
  await user.save();

  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" }
  );

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
  });

  // Send email after response
  sendWelcomeEmail(email);
});






export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP. Expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!otp) {
    return res.json({
      success: false,
      message: "Missing OTP",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email Verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: "No authentication token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.json({ success: false, message: "Invalid token" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "Authenticated" });
  } catch (error) {
    return res.json({ success: false, message: "Authentication failed" });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password. Expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP Expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

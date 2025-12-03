import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send welcome email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Our Service",
      text: `Hello ${name},\n\nThank you for registering at our service!\n\nBest regards,\nThe Team`,
    }

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await userModel.findById(userId);

    if (user.isVerified) {
      return res.json({ success: false, message: "User already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); 

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Email Verification",
      //text: `Your verification OTP is: ${otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification email sent" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// verify email with otp
export const verifyEmail = async (req, res) => {
  
  const {userId, otp} = req.body;
    if (!userId || !otp) {
      return res.json({ success: false, message: "User ID and OTP are required" });
    }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp == '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    user.isVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message }); 
  }
}


// if the user is authenticated
export const  isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// send reset password email
export const sendResetOtp = async (req, res) => {
  const {email} = req.body;
  
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); 

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset",
      //text: `Your password reset OTP is: ${otp}`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp),
      
      
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Reset OTP sent" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// reset password using otp
export const resetPassword = async (req, res) => {
  const {email, otp, newPassword} = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP and new password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp == '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
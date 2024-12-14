import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Joi from "joi";

// SIGN_UP

export const signup = async (req, res, next) => {
  try {
    // **1. Input Validation**
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json(error);

    const { username, email, password } = req.body;

    // **2. Check for Existing User**
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    // **3. Hash Password**
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // **4. Create User**
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // **5. Generate JWT Token**
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // **6. Respond to Client (Auto-Signin)**
    const { password: pass, ...rest } = newUser._doc; // Exclude password in response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        message: "User signed up and signed in successfully",
        user: rest,
      });
  } catch (error) {
    next(error);
  }
};

// SIGN_IN

export const signin = async (req, res, next) => {
  try {
    // User input validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json("Invalid email or Password");
    const { email, password } = req.body;

    // Find user
    const validUser = await User.findOne({ email });
    if (!validUser) return res.status(401).json("Invalid email or password");

    // Verify password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      validUser.failedLoginAttempts = (validUser.failedLoginAttempts || 0) + 1;
      if (validUser.failedLoginAttempts >= 5) {
        validUser.isLocked = true;
      }
      await validUser.save();
      return res.status(401).json("Invalid email or password");
    }

    // Generate tokens
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

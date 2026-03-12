import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Generellt felmeddelande som alltid används vid misslyckad login
    const invalid = () =>
      res.status(401).json({ message: "User credentials are invalid" });

    if (!email || !password) {
      return invalid();
    }

    // password är select:false, så vi måste explicit hämta det
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return invalid();
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return invalid();
    }

    // Lyckad login: returnera minimalt och säkert
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email
    });
  } catch {
    // Även vid serverfel: returnera inte detaljer som kan hjälpa angripare
    return res.status(401).json({ message: "User credentials are invalid" });
  }
});



export default router;
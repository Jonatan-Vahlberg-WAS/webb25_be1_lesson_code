import { Router } from "express";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/tokens.js";

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

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ accessToken, refreshToken, user: userObj });
  } catch (error) {
    console.error(error);
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

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const userObj = user.toObject();
    delete userObj.password;

    // Lyckad login: returnera minimalt och säkert
    return res.json({ accessToken, refreshToken, user: userObj });
  } catch {
    // Även vid serverfel: returnera inte detaljer som kan hjälpa angripare
    return res.status(401).json({ message: "User credentials are invalid" });
  }
});

router.get("/me", async (req, res) => {
  const invalid = () => res.status(401).json({ message: "Unauthorized" });
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new Error("Unauthorized");
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.json(userObj);
  } catch (error) {
    console.error(error);
    return invalid();
  }
});

router.post("/refresh", async (req, res) => {
  const invalid = () => res.status(401).json({ message: "Unauthorized" });
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error("Unauthorized");
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error("Unauthorized");
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("Unauthorized");
    }
    const accessToken = generateAccessToken(user.id);
    return res.json({ accessToken });
  } catch {
    return invalid();
  }
});


export default router;
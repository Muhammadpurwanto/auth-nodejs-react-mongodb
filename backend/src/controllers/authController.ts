import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, {IUser} from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: IUser;
}

// Register user
export const registerUser = async (req:Request, res: Response)=>{
    try{
        const {name, email, password} = req.body;

        // Validation input
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Return response tanpa password
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Simpan refresh token ke DB
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    // Cari user dengan refreshToken
    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Verifikasi refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET as string, (err, decoded: any) => {
      if (err || !decoded) return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateAccessToken(user._id.toString());
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Hapus refresh token
    user.refreshToken = "";
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(req.user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
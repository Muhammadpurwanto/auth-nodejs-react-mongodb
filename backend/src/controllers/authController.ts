import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, {IUser} from "../models/User";
import { generateToken } from "../utils/generateToken";

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

export const loginUser = async (req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;

        // Validasi input
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        // Cari user berdasarkan email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        // Jika suskse return user + token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(req.user);
};
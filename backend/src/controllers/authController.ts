import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

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
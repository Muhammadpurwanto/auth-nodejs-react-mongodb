import mongoose, {Schema, Document} from "mongoose";

// interface untuk typescript
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
}

// Schema MongoDB
const UserSchema: Schema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: [6, "Password mush be at least 6 characters"],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {versionKey: false}
);

export default mongoose.model<IUser>("User", UserSchema);
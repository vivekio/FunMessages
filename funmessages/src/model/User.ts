import mongoose, { Schema, Document } from "mongoose";

// export interface User extends Document {
//     username: string;
//     email: string;
//     password: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  message: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: { type: String, required: [true, "Username is required"]  , unique: [true, "Username already exists"] , trim: true},
  email: { type: String, required: [true, "Email is required"] , unique: [true, "Email already exists"], match: [/^\S+@\S+\.\S+$/, "Email is not valid"], trim: true },
  password: { type: String, required: [true, "Password is required"]  },
  verifyCode: { type: String, required: [true, "Verify code is required"] },
  verifyCodeExpire: { type: Date, required: [true, "Verify code expiration date is required"] },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  message: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default User;

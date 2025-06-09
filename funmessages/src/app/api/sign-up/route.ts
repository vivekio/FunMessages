import { sendVerificationEmail } from "@/helpers/sendverificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ username, isVerified: true });
        if (existingUser) {
            return Response.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }
        const existingEmail = await User.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code
        if (existingEmail) {
            if (existingEmail.isVerified) {
                return Response.json(
                    { success: false, message: "Email already exists" },
                    { status: 400 }
                );
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
                existingEmail.password = hashedPassword;
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpire = expiryDate;
                await existingEmail.save();
            }
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // Set expiration to 1 hour from now

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            });
            await newUser.save();
        }



        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }

        return Response.json({ success: true, message: "User created successfully ,  please verify your email" }, {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Internal Server Error" }, {
            status: 500,
        });
    }
}
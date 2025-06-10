import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";

export async function POST(request: Request) {

    try { 
        const { code, username } = await request.json();
        await dbConnect();
        const user = await User.findOne({ username: username })
        if (!user) {
            return Response.json({ success: false, message: "username not found" }, { status: 400 });
        }
        const checkingcode = user.verifyCode === code;
        const isCodeExpired = user.verifyCodeExpire > new Date();
        if (checkingcode && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "User verified successfully" }, { status: 200 });
        } else  if (!checkingcode){
            return Response.json({ success: false, message: "Code is incorrect" }, { status: 400 });
        } else {
            return Response.json({ success: false, message: "Code is expired" }, { status: 400 });
        }

      
    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json({ success: false, message: "Error verifying code" }, { status: 500 });
    }
}
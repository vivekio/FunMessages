import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";




const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {


    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const result = UsernameQuerySchema.safeParse({ username });
        if (!result.success) {
            return Response.json({ success: false, message: result.error.format().username?._errors[0] || [] }, { status: 400 });
        }
        const existingUser = await User.findOne({ username , isVerified: true });
        if (existingUser) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
        }
        return Response.json({ success: true, message: "Username is unique" }, { status: 200 });


    } catch (error) {
        console.error("Error checking username :", error);
        return Response.json({ success: false, message: "Error checking username" }, { status: 500 });
    }

}
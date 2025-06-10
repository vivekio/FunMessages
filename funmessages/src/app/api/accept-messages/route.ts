import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return  Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const user:User = session?.user as User;
    const userID = user._id ;
   const { isAcceptingMessages } = await request.json();

    try {
        const updatedUser = await Usermodel.findOneAndUpdate({ _id: userID }, { isAcceptingMessages }, { new: true });
        if (!updatedUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "Messages accepted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error accepting messages:", error);
        return Response.json({ success: false, message: "Error accepting messages" }, { status: 500 });
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return  Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const user:User = session?.user as User;
    const userID = user._id ;
   try {
    const foundUser = await Usermodel.findById(userID);
    if (!foundUser) {
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, isAcceptingMessages: foundUser.isAcceptingMessages }, { status: 200 });
   } catch (error) {
    console.error("Error accepting messages:", error);
        return Response.json({ success: false, message: "Error accepting messages" }, { status: 500 });
   }
    

}
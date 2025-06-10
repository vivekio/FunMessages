import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const user:User = session?.user as User;
    const userID = new mongoose.Types.ObjectId(user._id);
    try {
        const foundUser = await Usermodel.aggregate([
            {
                $match: {
                    _id: userID,
                },
            },
            {
                $unwind: "$messages",
            },{
                $sort:{
                    'messages.createdAt': -1
                }
            } ,{
                $group:{
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const messages = foundUser[0].messages;
        return Response.json({ success: true, messages }, { status: 200 });
    } catch (error) {
        console.error("Error getting messages:", error);
        return Response.json({ success: false, message: "Error getting messages" }, { status: 500 });
    }
}
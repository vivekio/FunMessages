import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import { Message } from "@/model/User";



export async function POST(request: Request) {
    await dbConnect();
    const {username , content} = await request.json();
    try {
       const user = await User.findOne({username}) 
       if(!user){
           return Response.json({ success: false, message: "User not found" }, { status: 404 });
       }
       if (!user.isAcceptingMessages) {
                return Response.json({ success: false, message: "User is not accepting messages" }, { status: 404 });
       }
       const newMessage = { content : content , createdAt: new Date() };
       user.message.push(newMessage as Message);
       await user.save();
               return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
       console.error("Error getting messages:", error);
        return Response.json({ success: false, message: "Error send message" }, { status: 500 });
    }
    
}

import 'next-auth'

declare module 'next-auth' {
    interface User {
        _id?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean; // Optional, depending on your user model
    }
    
    interface Session {
        user: User & DefaultSession['user'];
    }

    interface JWT {
        _id?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}

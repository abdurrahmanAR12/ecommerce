import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import clientPromise from "../../../Components/auth.lib";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const authOptions = {
    // Configure one or more authentication providers
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
}

export default NextAuth(authOptions)
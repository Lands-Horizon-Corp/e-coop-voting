import type { GetServerSidePropsContext } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultUser, getServerSession, type NextAuthOptions } from "next-auth";

import { login } from "@/services/auth";
import { getUserWithoutPassword } from "@/services/user";
import { AuthenticationError } from "@/errors/auth-error";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await login(credentials as any);
                return user as {} as DefaultUser;
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    session: {
        strategy: "jwt",
        maxAge: 28000,
    },
    jwt: {
        maxAge: 28000,
    },
    callbacks: {
        async signIn({ user }) {
            const fetchUserData = getUserWithoutPassword(user.email as string);
            if (!fetchUserData) return false;
            return true;
        },
        async session({ session, token}) {
            const fetchUserData = await getUserWithoutPassword(session.user.email);
            if(fetchUserData) session.user = fetchUserData

            return session;
        },
    },
};

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => getServerSession(ctx.req, ctx.res, authOptions);

export const currentUser = async () => await getServerSession(authOptions);

/**
 * Senpai Dev Docs 2024 : Function to check the current user and return the user if found, or send an 403 not allowed response if not found.
 * @returns The current user if found.
 */
export const currentUserOrThrowAuthError = async() => {
    const session = await currentUser()
    if(session === null) throw new AuthenticationError("You are not authorized!")
    return session.user
}

/**
 * Senpai Dev Docs 2024 : Function to get current user and return the user if found, or return false if not found.
 * @returns The current user if found.
 */
export const currentUserOrFalse = async() => {
    const session = await currentUser()
    if(session === null) return false;
    return session.user
}
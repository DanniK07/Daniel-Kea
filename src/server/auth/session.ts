import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/nextAuth";

export function getSession() {
  return getServerSession(authOptions);
}


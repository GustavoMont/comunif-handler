import { env } from "@/constants/env";
import { io } from "socket.io-client";

export const socket = io(env.apiUrl ?? "", {
  autoConnect: false,
});

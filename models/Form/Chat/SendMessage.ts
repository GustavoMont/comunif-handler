import { Message } from "@/models/Message";

export type SendMessagePayload = Pick<
  Message,
  "communityChannelId" | "userId" | "content"
>;

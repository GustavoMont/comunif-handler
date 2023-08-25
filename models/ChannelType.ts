export type ChannelTypeName = "jobs" | "chat" | "material" | "doubt" | "other";

export interface ChannelType {
  id: number;
  name: ChannelTypeName;
  description: string;
}

import Discord from "discord.js";

export interface INewClient {
  commands?: Discord.Collection<any, any>;
}
export type IClient = Discord.Client & INewClient;

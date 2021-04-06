import { VoiceChannel } from "discord.js";
import { db } from "../database/index";
import { BaseModel } from "./base.model";

export interface ICleanChannel {
  id: string;
  interval: number;
  updated_at: string | undefined | null;
  serverId: string
}

export class CleanChannelModel extends BaseModel<ICleanChannel> {

  constructor () {
    super()

    // Set default table
    this.db = db.get('cleanChannel');
  }
}
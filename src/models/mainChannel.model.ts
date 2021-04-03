import { VoiceChannel } from "discord.js";
import { db } from "../database/index";
import { BaseModel } from "./base.model";

export interface IMainChannel {
  id: string;
  defaultName: string;
  serverId: string
}

export class MainChannelModel extends BaseModel<IMainChannel> {

  constructor () {
    super()

    // Set default table
    this.db = db.get('mainChannel');
  }
}
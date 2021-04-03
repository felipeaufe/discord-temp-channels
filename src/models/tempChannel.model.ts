import { VoiceChannel } from "discord.js";
import { db } from "../database/index";
import { BaseModel } from "./base.model";

export interface ITempChannel {
  id: string;
  serverId: string;
  mainId: string;
  number: number;
}

export class TempChannelModel extends BaseModel<ITempChannel> {

  constructor () {
    super()

    // Set default table
    this.db = db.get('tempChannel');
  }
}
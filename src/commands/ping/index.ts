import Discord from 'discord.js';
import { enumCommands } from '../../enums/commands.enum';

export class Ping {
  /**
   * Command trigger
   */
  public name = enumCommands.ping;

  /**
   * Command description
   */
  public description = 'Ping!';

  /**
   * Main function to execute command;
   * 
   * @param message Discord.Message object
   * @param args Arguments
   */
  public execute (message: Discord.Message, args: Array<string>) {
    message.channel.send('Pong!');
  }
}
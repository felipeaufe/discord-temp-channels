import Discord from 'discord.js';
import { enumCommands } from '../../enums/commands.enum';

export class Username {
  /**
   * Command trigger
   */
  public name = enumCommands.username;

  /**
   * Command description
   */
  public description = 'Username';

  /**
   * Main function to execute command;
   * 
   * @param message Discord.Message object
   * @param args Arguments
   */
  public execute (message: Discord.Message, args: Array<string>) {
    message.channel.send(`Your username is \`${message.author.username}\`!`);
  }
}
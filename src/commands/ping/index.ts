import Discord from 'discord.js';

export class Ping {
  /**
   * Command trigger
   */
  public name = 'ping';

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
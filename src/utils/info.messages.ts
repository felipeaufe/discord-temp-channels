import Discord from 'discord.js';
import { color, timeout } from '../environments/config';

export class Info {

  constructor () {}
  
  /**
   * Success message
   */
   public static success(message: Discord.Message | undefined): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor(color.brand)
      
      // Message
      .setDescription("**Finish!** Channel id: `12345`")

    ).then(sentMessage => sentMessage.delete({ timeout }));
  }

  /**
   * Success message
   */
   public static warning(message: Discord.Message | undefined): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor(color.warning)
      
      // Message
      .setDescription("**Finish!** Channel id: `12345`")

    ).then(sentMessage => sentMessage.delete({ timeout }));
  }

  /**
   * Error message
   */
  public static failure(message: Discord.Message | undefined, text?: string): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor(color.error)
      
      // Message
      .setDescription(text || "**Error!** Something did not go as expected. :( ")

    ).then(sentMessage => sentMessage.delete({ timeout }));
  }
}
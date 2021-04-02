import Discord from 'discord.js';

export class Info {

  /**
   * Timeout message
   */
  private static _timeout = 10000;

  constructor () {}
  
  /**
   * Success message
   */
   public static success(message: Discord.Message | undefined): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor('#0099ff')
      
      // Message
      .setDescription("**Finish!** Channel id: `12345`")

    ).then(sentMessage => sentMessage.delete({ timeout: this._timeout }));
  }

  /**
   * Success message
   */
   public static warning(message: Discord.Message | undefined): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor('#e7c000')
      
      // Message
      .setDescription("**Finish!** Channel id: `12345`")

    ).then(sentMessage => sentMessage.delete({ timeout: this._timeout }));
  }

  /**
   * Error message
   */
  public static failure(message: Discord.Message | undefined, text?: string): void{
    message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor('#cf0202')
      
      // Message
      .setDescription(text || "**Error!** Something did not go as expected. :( ")

    ).then(sentMessage => sentMessage.delete({ timeout: this._timeout }));
  }
}
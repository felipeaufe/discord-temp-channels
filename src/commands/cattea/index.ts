import Discord from 'discord.js';
import { prefix, color, timeout } from '../../environments/config';
import { enumCommands } from '../../enums/commands.enum';

export class Cattea {
  /**
   * Command trigger
   */
  public name = enumCommands.cattea;

  /**
  * Command description
  */
  public description = 'Cattea helper!';

  constructor(){};

  /**
  * Main function to execute command;
  * 
  * @param message Discord.Message object
  * @param args Arguments
  */
  public execute (message: Discord.Message) {

    message.channel.send(new Discord.MessageEmbed()
      // Barr color
      .setColor(color.brand)
      
      // Attach image
      .attachFiles(['./src/assets/img/cattea-logo.jpeg'])
      
      // Author name and link
      .setAuthor('Hey, how\'s it going? Hope so.', 'attachment://cattea-logo.jpeg', 'https://discord.js.org')
      .setDescription(`To interact with me just type ct! followed by some of the commands below:\n`)

      // Temporary Channel
      .addField(
        'Creating a temporary channel:',
        `
          > - Try this command to know more about it:
          > \`${prefix}${enumCommands.temp}\`
        `,
      )
       
      // Auto-clear
      .addField(
        'Automatically clearing your text channel:',
        `
          > - Try this command to know more about it:
          > \`${prefix}${enumCommands.clean}\`
        `,
      )

      // Footer
      .setTimestamp()
      .setFooter(`${message.author.username}`, `${message.author.avatarURL()}`)
    ).then((messageSent: Discord.Message) => {
      messageSent.delete({
        timeout: timeout * 5
      });
    });

    // Remove command message;
    message.delete({
      timeout: timeout
    });
  }
}
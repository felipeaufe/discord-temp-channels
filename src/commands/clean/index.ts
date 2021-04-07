import Discord from 'discord.js';
import { enumCommands } from '../../enums/commands.enum';
import { enumDiscordAPIError } from '../../enums/errors.enum';
import { prefix, color, timeout } from '../../environments/config';
import { Info } from '../../utils/info.messages';
import { db, ICleanChannel } from '../../models'

interface ICleanTextChannel extends ICleanChannel {
  channel?: Discord.TextChannel;
}
export class Clean {
  /**
   * Command trigger
   */
  public name = enumCommands.clean;

  /**
   * Command description
   */
  public description = 'Cleaning text channel!';

  /**
   * Globalizing Discord message function
   */
  private _message: Discord.Message | undefined;

  /**
   * Loaded text channels
   */
  private static _channels: Array<ICleanTextChannel> = [];

  /**
   * default Interval in minutes
   */
  private _interval = 60;

  /**
   * Constructor
   * 
   * @param _client Discord.Client
   */
  constructor(private _client: Discord.Client){};

  /**
   * Main function to execute command;
   * 
   * @param message Discord.Message object
   * @param args Arguments
   */
  public execute (message: Discord.Message, args: Array<string>) {
    
    this._message = message;

    if(!args.length){
      message.channel.send(
        this._instructions(message.author)
      );
    } else {
      this._newCleanChannel(args);
    }

    message.delete({ timeout });
  }

  /**
   * Every minute check if some channel need to be cleaned
   * 
   * @param client: Discord.Client
   */
  public static schedule(client: Discord.Client) {
    setInterval (async () => {
      try {
        this._updateScheduleChannels(client);

        this._channels = this._channels.map((item: ICleanTextChannel) => {
      
          // Update next data;
          if(item.updated_at < new Date().getTime()) {
            const newDate = new Date(item.updated_at + (item.interval * 60000));
            item.updated_at = newDate.getTime();

            this._clearChannel(item);

            // Update db
            db.cleanChannel.update(item.id, {
              "id": item.id,
              "serverId": item.serverId,
              "interval": item.interval,
              "updated_at": item.updated_at
            } as ICleanChannel);
          }

          return item;
        });
      } catch (error) {
        console.error(error);
      }
    }, 1 * 60000); 
  }

  /**
   * Clear text channel
   * 
   * @param item ICleanTextChannel
   */
  private static async _clearChannel(item: ICleanTextChannel){
    const messages = await item.channel?.messages.fetch({ limit: 100});
    if(messages) {
      item.channel?.bulkDelete(messages);
    }
  }

  /**
   * Check if has a new text channel to be clear;
   * 
   * @param client Discord.Client
   */
  private static _updateScheduleChannels(client: Discord.Client){
    
    const channels: Array<ICleanChannel> = (db.cleanChannel.list() || []) as Array<ICleanChannel>;
    const channelsId: Array<string> = this._channels.map((item: ICleanTextChannel) => item.id);

    channels.forEach( async (item: ICleanChannel) => {
      if(!channelsId.includes(item.id)){

        const channel: Discord.TextChannel = await client.channels.fetch(item.id) as Discord.TextChannel
        if(channel) {
          this._channels.push({ ...item, channel });
        }
      }
    });
  }

 /**
  * Print the clean step-by-step to create a cleaning channel schedule
  * 
  * @returns Discord MessageEmbed with instructions
  */
  private _instructions(author: Discord.User): Discord.MessageEmbed {
    return new Discord.MessageEmbed()

    // Barr color
    .setColor(color.brand)
    
    // Attach image
    .attachFiles(['./src/assets/img/cattea-logo.jpeg'])
    
    // Author name and link
    .setAuthor('Automatically clearing your text channel', 'attachment://cattea-logo.jpeg', 'https://discord.js.org')
    .setDescription(`
      > - Configuring a text channel:
      > \`${prefix}${enumCommands.clean} [channelId]\`
      > 
      > - Setting interval:
      > \`${prefix}${enumCommands.clean} [channelId] [interval] \`
      > 
      > The interval will be in minutes, so you can put 60 for 1 hour, 120 for 2 hours, etc. Example:
      > 
      > \`${prefix}${enumCommands.clean} 1234 5 \`
      > 
      > Desc: This command will clear the text channel every 5 minutes.
    `)

    // Footer
    .setTimestamp()
    .setFooter(`${author.username}`, `${author.avatarURL()}`);
  }

  /**
   * Create a new clean channel based on id and interval
   * this channel will be cleaning every time set in interval
   * 
   * @param args Arguments
   */
   private _newCleanChannel(args: Array<string>): void {

    this._client.channels.fetch(args[0])
      .then((channel: Discord.Channel) => {
        if(channel.type !== "text"){
          return Info.failure(this._message, `The id ${args[0]} is not a text channel;`)
        }

        const interval = Number(args[1]) || this._interval;

        // Persist
        db.cleanChannel.updateOrAdd(channel.id, {
          id: channel.id,
          serverId: this._message?.guild?.id || '',
          interval,
          updated_at: new Date().getTime()
        });

        Info.success(this._message);
      })
      .catch((error: any) => {
        let message: string | undefined;
        
        if(error == enumDiscordAPIError.UnknownChannel){
          message = `Channel not found with ID: \`${args[0]}\``;
        }
        
        Info.failure(this._message, message);
        console.error("Error: ", error);
      })
  }

}
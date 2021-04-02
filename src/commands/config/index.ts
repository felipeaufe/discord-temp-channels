import Discord from 'discord.js';
import { enumDiscordAPIError } from '../../enums/errors.enum';

interface ITempChannelList {
  channel: Discord.VoiceChannel;
  countName: number;
}
interface IChannelName {
  name: string;
  count: number;
}
export default class Config {
  /**
   * Command trigger
   */
 public name = 'config';

 /**
  * Command description
  */
 public description = 'Config!';

 /**
  * Default channel's name
  */
 public _defaultName: string | undefined;

 /**
  * Globalizing Discord message function
  */
 private _message: Discord.Message | undefined;

 /**
  * List of main channels id
  */
 private _mainChannelsId: Array<string> = [];

 /**
  * List of temporary channels
  */
 private _tempChannels: Array<ITempChannelList> = [];

 /**
  * Message timeout to be excluded
  */
 private _timeout = 10000;

 constructor(private _client: Discord.Client){
  _client.on('voiceStateUpdate', (oldState: Discord.VoiceState, newState: any /*Discord.VoiceState*/) => {
    this._stateUpdate(newState);
  });
 };

 /**
  * Main function to execute command;
  * 
  * @param message Discord.Message object
  * @param args Arguments
  */
 public execute (message: Discord.Message, args: Array<string>) {
    console.log('Args: ', args);
    this._message = message;

    if(!args.length){
      message.channel.send(
        this._instructions(message.author)
      );
    }

    this._newMainChannel(args);
 }

 /**
  * Print the config step-by-step to create a new temporary channel
  * 
  * @returns Discord MessageEmbed with instructions
  */
  private _instructions(author: Discord.User): Discord.MessageEmbed {
      return new Discord.MessageEmbed()

    // Barr color
    .setColor('#0099ff')
    
    // Attach image
    .attachFiles(['./src/assets/img/tc-logo.png'])
    
    // Author name and link
    .setAuthor('Temp Channels', 'attachment://tc-logo.png', 'https://discord.js.org')
    .setDescription(`Welcome to Temp Channels bot.\n`)

    // Body
    .addField(
      '> Start configuration:',
      `
        > 
        > 1. Creating new channel:
        > \`tc!config [channelId]\`
        > 
        > 2. Change default name:
        > \`tc!config [channelId] '[ChannelName]' \`

        > By default, the channel number will be at the end of the name, but you can change it by including the ## prefix in the channel name, for example:
        > \`tc!config 1234 Temporary room n.## \`

      `,
    )

    // Footer
    .setTimestamp()
    .setFooter(`${author.username}`, `${author.avatarURL()}`);
  }

  /**
   * Create a new main channel based on args
   * this new main channel will be possible create new temporary channels
   * 
   * @param args Arguments
   */
  private _newMainChannel(args: Array<string>): void {

    this._client.channels.fetch(args[0])
      .then((channel: Discord.Channel) => {
        if(channel.type !== "voice"){
          return this._failure(`The id ${args[0]} is not a voice channel;`)
        }
        
        this._mainChannelsId.push(channel.id);
        this._success();
      })
      .catch((error: any) => {
        let message: string | undefined;
        
        if(error == enumDiscordAPIError.UnknownChannel){
          message = `Channel not found with ID: \`${args[0]}\``;
        }
        
        this._failure(message);
        console.error("Error: ", error);
      })
  }

  /**
   * Client event on state update
   * This event will create new temporary channel or delete empty one
   * 
   * @param newState New State
   */
  private _stateUpdate (newState: any /*Discord.VoiceState*/): void {
  
    // Create new temporary channel
    if(this._mainChannelsId.includes(newState.channelID)) {
      const channelName: IChannelName = this._channelName(newState);
      newState.guild.channels.create(channelName.name, {
        type: 'voice',
        permissionOverwrites: [
          {
            id: newState.guild.roles.everyone,
          }
        ],
      })
      .then((channel: Discord.VoiceChannel) => {
        this._tempChannels.push({
          channel,
          countName: channelName.count
        })

        newState.member.voice.setChannel(channel);
      })
      .catch((error: any) => {
        console.error(error);
        this._failure("An error occurred while trying to create a temporary channel.")
      });
    }

    // Delete empty temporary channel
    if(this._tempChannels.length >= 0) {
      this._tempChannels.forEach( async (item: ITempChannelList, index: number) => {
        if(item.channel.members.size <= 0 ){
          await item.channel.delete();
          this._tempChannels.splice(index, 1)
        }
      });
    }
  } 

  /**
   * Verify an available count name
   * 
   * @returns Channel count name
   */
  private _newChannelCount (): number {
    const existents: Array<number> = this._tempChannels.map((item: ITempChannelList) => {
      return item.countName;
    });

    for (let count = 1; count <= 999; count++) {
      if(!existents.includes(count)) {
        return count;
      }
    }

    return 0;
  }

  /**
   * Create a channel name
   * 
   * @param newState New state
   * @returns channel name with IChanelName interface
   */
  private _channelName(newState: any /*Discord.VoiceState*/): IChannelName {
    const nameCount = this._newChannelCount();
    const name = this._defaultName || newState.member.user.username;
    
    // Return default name
    if(!this._defaultName){
      return {
        name: ` #${nameCount} | ${name}'s channel`,
        count: nameCount
      };
    }

    // Return new Default name with mask
    if(name.indexOf("##") > -1){
      return {
        name: name.replace('##', `${nameCount}`),
        count: nameCount
      };
    }

    // Return new Default name without mask
    return {
      name: `${name} #${nameCount}`,
      count: nameCount
    }
  }

  /**
   * Success message
   */
  private _success(): void{
    this._message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor('#0099ff')
      
      // Message
      .setDescription("**Finish!** Channel id: `12345`")

    ).then(sentMessage => sentMessage.delete({ timeout: this._timeout }));
  }

  /**
   * Error message
   */
  private _failure(message?: string): void{
    this._message?.channel.send(new Discord.MessageEmbed()
    
      // Barr color
      .setColor('#cf0202')
      
      // Message
      .setDescription(message || "**Error!** Something did not go as expected. :( ")

    ).then(sentMessage => sentMessage.delete({ timeout: this._timeout }));
  }
}
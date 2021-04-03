import Discord from 'discord.js';
import { enumDiscordAPIError } from '../../enums/errors.enum';
import { Info } from '../../utils/info.messages';
import { db, IMainChannel, ITempChannel } from '../../models';

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
  * Globalizing Discord message function
  */
 private _message: Discord.Message | undefined;

 /**
  * Message timeout to be excluded
  */
 private _timeout = 10000;

 constructor(private _client: Discord.Client){
  _client.on('voiceStateUpdate', (oldState: Discord.VoiceState, newState: any /*Discord.VoiceState*/) => {
    this._stateUpdate(newState);
  });

  _client.on('channelDelete', channel => {
    this._removeMainChannel(channel.id);
  });
 };

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
    }

    this._newMainChannel(args);
    // message.delete({
    //   timeout: this._timeout
    // });
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
          return Info.failure(this._message, `The id ${args[0]} is not a voice channel;`)
        }

        // Persist
        db.mainChannel.updateOrAdd(channel.id, {
          id: channel.id,
          defaultName: this._setDefaultName(args),
          serverId: this._message?.guild?.id || ''
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

  /**
   * Create a new temporary channel
   * 
   * @param newState
   */
  private _newTempChannel(newState: any /*Discord.VoiceState*/): void {
    // Check if channelID is a Main Channel
    const mainChannel = db.mainChannel.findById(newState.channelID)
    if(mainChannel) {
      const channelName: IChannelName = this._channelName(mainChannel, newState);
      newState.guild.channels.create(channelName.name, {
        type: 'voice',
        permissionOverwrites: [{ id: newState.guild.roles.everyone }],
      })
      .then(async (channel: Discord.VoiceChannel) => {
        
        // Move owner to your new channel
        newState.member.voice.setChannel(channel);
        
        // Set new position to new temporary channel
        const parent: Discord.VoiceChannel = await this._client.channels.fetch(newState.channelID) as Discord.VoiceChannel;
        channel.setPosition(parent.rawPosition +1 )
  
        // Persist
        db.tempChannel.add({
          id: channel.id,
          serverId: newState.guild.id,
          mainId: newState.channelID,
          number: channelName.count
        })
      })
      .catch((error: any) => {
        console.error(error);
        Info.failure(this._message, "An error occurred while trying to create a temporary channel.")
      });
    }
  }


  /**
   * Remove channel delete from mainChannel list
   * @param channelId Channel Id
   */
   private _removeMainChannel(channelId: string): void {

    if(db.mainChannel.findById(channelId)){
      db.mainChannel.remove(channelId);
    }
  }

  /**
   * Remove temporary channel
   */
  private _removeTempChannel(): void{
    // Check if exist any empty temporary channel
    const tempChannels = db.tempChannel.list();
    if(tempChannels.length >= 0) {
      tempChannels.forEach( async (item: ITempChannel) => {
        const channel: Discord.VoiceChannel = await this._client.channels.fetch(item.id) as Discord.VoiceChannel;
        if(channel.members.size <= 0 ){
          await channel.delete();
          db.tempChannel.remove(item.id);
        }
      });
    }
  }

  /**
   * Client event on state update
   * This event will create new temporary channel or delete empty one
   * 
   * @param newState New State
   */
  private _stateUpdate (newState: any /*Discord.VoiceState*/): void {
  
    // Create new temporary channel
    this._newTempChannel(newState);

    // Or | And

    // Delete empty temporary channel
    this._removeTempChannel();
  } 

  /**
   * Verify an available count name
   * 
   * @returns Channel count name
   */
  private _newChannelCount (): number {
    const numbers: Array<number> = (db.tempChannel.list() || [])
      .map((item: ITempChannel) => {
        return item.number
      });

    for (let count = 1; count <= 999; count++) {
      if(!numbers.includes(count)) {
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
  private _channelName(mainChannel: IMainChannel, newState: any /*Discord.VoiceState*/): IChannelName {
    const nameCount = this._newChannelCount();
    const name = mainChannel.defaultName || newState.member.user.username;
    
    // Return default name
    if(!mainChannel.defaultName){
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
   * Set the new default temporary channel name;
   * 
   * @param args Params array
   */
  private _setDefaultName (args: Array<string>) {
    if(args[1]){
      const params = args;
      params.splice(0,1);
  
      return params.join(' ');
    }

    return '';
  }
}
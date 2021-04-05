import Discord from "discord.js";
import { prefix } from "../environments/config";
import { getCommandList } from '../utils/commands'
import { IClient } from '../interfaces/client.interface'

const client: IClient = new Discord.Client();
client.commands = new Discord.Collection();

// Inicialize commands
for (const file of getCommandList()) {
	const _class: any = require(`../commands/${file}`);
  const key = Object.keys(_class)[0];
  const command: any = new _class[key](client)
	client.commands.set(command.name, command);
}

// Client ready
client.once('ready', () => {
	console.log('\n======================');
	console.log('Temp Channel is Ready!');
	console.log('======================\n');
});


client.on('message', (message: Discord.Message) =>{

  console.log('~> Message: ', message);
  
  // Scape if not found the prefix in message
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Command trigger
  const args: any = message.content.slice(prefix.length).trim().split(/ +/);
	const command: string = args.shift().toLowerCase();

  // Scape if not found any command
  if (!client.commands?.has(command)) return;

  try {
    client.commands?.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

export default client;
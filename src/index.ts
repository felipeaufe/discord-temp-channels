import Discord from "discord.js";
import { token, prefix } from "./environments/config";
import { getCommandList } from './utils/commands'

const client: any = new Discord.Client();
client.commands = new Discord.Collection();

// Inicialize commands
for (const file of getCommandList()) {
	const _class: any = require(`./commands/${file}`);
  const command: any = new _class.default()
	client.commands.set(command.name, command);
}

// Clinet ready
client.once('ready', () => {
	console.log('Ready!');
});

// Client command watcher
client.on('message', (message: Discord.Message) =>{

  // Scape if not found the prefix in message
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Command trigger
  const args: any = message.content.slice(prefix.length).trim().split(/ +/);
	const command: string = args.shift().toLowerCase();

  // Scape if not found any command
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

// Login
client.login(token);

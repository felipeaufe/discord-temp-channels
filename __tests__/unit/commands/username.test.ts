import Discord from 'discord.js';
import { enumCommands } from '../../../src/enums/commands.enum';
import { Username } from '../../../src/commands/username';

describe(`Command ${enumCommands.username}`, () => {
  
  // Global config
  const command = new Username();

  it(`should have command named "${enumCommands.username}".`, () => {
    // Expect
    expect(typeof command.name).toEqual('string');
    expect(command.name).toEqual(enumCommands.username);
  });

  it('Should be send username to text channel.', () => {

    // Set
    const author = { username: 'FelipeAufe' } ;
    const channel = { send: jest.fn() };
    const message: Discord.Message = ({ 
      author,
      channel
    } as unknown) as Discord.Message;

    const sendSpy = jest.spyOn(channel, 'send');

    // Execute
    command.execute(message, []);

    // Expect
    expect(sendSpy).toBeCalledTimes(1);
    expect(sendSpy).toBeCalledWith(`Your username is \`${author.username}\`!`);
  });
});
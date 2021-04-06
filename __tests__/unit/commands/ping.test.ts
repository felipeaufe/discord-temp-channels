import { Ping } from '../../../src/commands/ping';
import { enumCommands } from '../../../src/enums/commands.enum';
import Discord from 'discord.js';

describe(`Command ${enumCommands.ping}`, () => {

  // Global config
  const command = new Ping();

  it(`should have command named "${enumCommands.ping}".`, () => {
    // Expect
    expect(typeof command.name).toEqual('string');
    expect(command.name).toEqual(enumCommands.ping);
  });

  it('Should be send "Pong!" to text channel.', () => {

    // set
    const channel = { send: jest.fn() };
    const message: Discord.Message = ({ 
      channel
    } as unknown) as Discord.Message;

    const sendSpy = jest.spyOn(channel, 'send');
    
    // execute
    command.execute(message, [enumCommands.ping])
  
    // expect
    expect(sendSpy).toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('Pong!');
  }); 
});
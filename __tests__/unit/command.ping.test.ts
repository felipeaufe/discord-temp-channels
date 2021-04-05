import { Ping } from '../../src/commands/ping';
import Discord from 'discord.js';

describe('Command Ping', () => {
  
  // Global config
  const command = new Ping();

  it('Should have command named "ping".', () => {
    // Expect
    expect(typeof command.name).toEqual('string');
    expect(command.name).toEqual('ping');
  });

  it('Should be send "Pong!" to text channel.', () => {

    // set
    const channel = { send: jest.fn() };
    const message: Discord.Message = ({ 
      channel
    } as unknown) as Discord.Message;

    const sendSpy = jest.spyOn(channel, 'send');
    
    // execute
    command.execute(message, ['ping'])
  
    // expect
    expect(sendSpy).toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('Pong!');
  }); 
});
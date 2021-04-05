import { Config } from '../../src/commands/config';
import Discord from 'discord.js';

// Global Config
const channels = { fetch: jest.fn().mockImplementation(() => Promise.resolve()) };
const client: Discord.Client = ({
  on: jest.fn(),
  channels
} as unknown) as Discord.Client;

describe('Command Config', () => {
  it('should have command named "config".', () => {

    // execute
    const command = new Config(client);

    // Expect
    expect(typeof command.name).toEqual("string");
    expect(command.name).toEqual("config");
  });

  it('should be call execute method', () => {
    
    // set
    const author = { 
      username: "Felipe",
      avatarURL: () => ''
     };
    const channel = { send: jest.fn() };
    const message: Discord.Message = ({
      delete: jest.fn(),
      channel,
      author
    } as unknown) as Discord.Message;

    const sendSpy = jest.spyOn(channel, 'send');
    const deleteSpy = jest.spyOn(message, 'delete');

    // execute
    const command = new Config(client);
    command.execute(message, []);

    // Expect
    expect(sendSpy).toBeCalledTimes(1);
    expect(sendSpy).toBeCalledWith(expect.any(Discord.MessageEmbed));

    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({ timeout: 10000 })
  });

  it('should be call the events on constructor', () => {
    
    // set
    const onSpy = jest.spyOn(client, 'on');

    // execute
    new Config(client);

    // Expect
    expect(onSpy).toBeCalledTimes(2);
    expect(onSpy).toHaveBeenNthCalledWith(1, 'voiceStateUpdate', expect.any(Function));
    expect(onSpy).toHaveBeenNthCalledWith(2, 'channelDelete', expect.any(Function));
  });
});

describe('Channel manipulations', () => {
  it('should be create a new main channel', () => {
    // set
    const command = new Config(client);
    // const _stateUpdate = jest.fn();
    
    //Expect
    // expect(command._stateUpdate).toBeCalledTimes(1);
  });
});
import { Temp } from '../../../src/commands/temp';
import { timeout } from '../../../src/environments/config';
import { enumCommands } from '../../../src/enums/commands.enum';
import Discord from 'discord.js';

// Global Temp
const channels = { fetch: jest.fn().mockImplementation(() => Promise.resolve()) };
const client: Discord.Client = ({
  on: jest.fn(),
  channels
} as unknown) as Discord.Client;
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

describe(`Command ${enumCommands.temp}`, () => {

  // Context config
  const command = new Temp(client);

  it(`should have command named "${enumCommands.temp}".`, () => {
    // Expect
    expect(typeof command.name).toEqual("string");
    expect(command.name).toEqual(enumCommands.temp);
  });

  it('should be call execute method', () => {
    
    // set
    const sendSpy = jest.spyOn(channel, 'send');
    const deleteSpy = jest.spyOn(message, 'delete');

    // execute
    command.execute(message, []);

    // Expect
    expect(sendSpy).toBeCalledTimes(1);
    expect(sendSpy).toBeCalledWith(expect.any(Discord.MessageEmbed));

    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({ timeout })
  });

  it('should be call the events on constructor', () => {
    
    // set
    const onSpy = jest.spyOn(client, 'on');

    // execute
    new Temp(client);

    // Expect
    expect(onSpy).toBeCalledTimes(2);
    expect(onSpy).toHaveBeenNthCalledWith(1, 'voiceStateUpdate', expect.any(Function));
    expect(onSpy).toHaveBeenNthCalledWith(2, 'channelDelete', expect.any(Function));
  });

  it('should have call _newMainChannel method', () => {
    
    //set 
    const fetchSpy = jest.spyOn(channels, 'fetch');
    const textChannelId = "1234";

    // execute
    command.execute(message, [textChannelId]);

    // expect
    expect(fetchSpy).toBeCalledTimes(1);
    expect(fetchSpy).toBeCalledWith(textChannelId);
  })
});

describe('Channel manipulations', () => {
  it('should be create a new main channel', () => {
    // set
    const command = new Temp(client);
    // const _stateUpdate = jest.fn();
    
    //Expect
    // expect(command._stateUpdate).toBeCalledTimes(1);
  });
});
import Discord from 'discord.js';
import { Clean } from '../../../src/commands/clean';
import { timeout } from '../../../src/environments/config';
import { enumCommands } from '../../../src/enums/commands.enum';
import { db, ICleanChannel }  from '../../../src/models';

// Global config
const channels = { fetch: jest.fn().mockImplementation(() => Promise.resolve()) };
const client: Discord.Client = ({
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

describe(`Command ${enumCommands.clean}`, () => {

  // Context config
  const command = new Clean(client);

  it(`should have command named "${enumCommands.clean}".`, () => {

    // expect
    expect(typeof command.name).toEqual('string');
    expect(command.name).toEqual(enumCommands.clean);
  });

  it('should have call execute method', () => {

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

  it('should have call _newCleanChannel method', () => {
    
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

describe(`Cleaning text channels`, () => {


  it('should be call setInterval every one minute', () => {

    // set
    jest.useFakeTimers();
    const oneMinute = 1 * 60000;

    // execute;
    Clean.schedule(client);

    // expect
    expect(setInterval).toBeCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), oneMinute);
  });

  it('should be call db object', () => {

    // set
    const dbItemMok: Array<ICleanChannel> = [{
      "id": "111111111111111111111",
      "serverId": "222222222222222222222",
      "interval": 1,
      "updated_at": 1617759638454
    }];
    const channels = { fetch: jest.fn().mockImplementation(() => Promise.resolve( {} )) };
    const client: Discord.Client = ({
    channels
    } as unknown) as Discord.Client;
    db.cleanChannel.list = jest.fn().mockImplementation(() => dbItemMok);
    
    // execute;
    Clean.schedule(client);

    // Expect
    jest.useFakeTimers();
    expect(db.cleanChannel.list).toHaveBeenCalledTimes(0);
    expect(Clean.channels).toHaveLength(0);
    
    jest.runOnlyPendingTimers();
    expect(db.cleanChannel.list).toHaveBeenCalledTimes(1);

    expect(Clean.channels).toHaveLength(1);

  });

  it('should be call _clearChannel methods', () => {});
  it('should be call _updateScheduleChannels methods', () => {});
});
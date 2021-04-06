import Discord from "discord.js";
import { timeout } from '../../../src/environments/config';
import { enumCommands } from "../../../src/enums/commands.enum";
import { Cattea } from '../../../src/commands/cattea';

describe('Command @Cattea', () => {

  const command = new Cattea();

  it(`should have command named ${enumCommands.cattea}`, () => {
    expect(typeof command.name).toEqual("string");
    expect(command.name).toEqual(enumCommands.cattea);
  });

  it('should be call execute method', () => {

    // set
    const channel = { send: jest.fn().mockImplementation(() => Promise.resolve()) };
    const author = {
      username: "FelipeAufe",
      avatarURL: jest.fn()
    };
    const message = ({ 
      channel,
      author,
      delete: jest.fn()
    } as unknown) as Discord.Message
    const sendSpy = jest.spyOn(channel, "send");

    // execute
    command.execute(message);

    // expect
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toBeCalledWith(expect.any(Discord.MessageEmbed));
    expect(message.delete).toBeCalledTimes(1);
    expect(message.delete).toBeCalledWith({ timeout });
  });
});
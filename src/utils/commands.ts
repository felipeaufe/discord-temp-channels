import fs from 'fs';

export const getCommandList = (): Array<string> => {
  return fs.readdirSync('./src/commands').filter(file => file);
}
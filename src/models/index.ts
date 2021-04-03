import { MainChannelModel } from './mainChannel.model';
import { TempChannelModel } from './tempChannel.model';

export { IMainChannel } from './mainChannel.model';
export { ITempChannel } from './tempChannel.model';

export const db = {
  mainChannel: new MainChannelModel(),
  tempChannel: new TempChannelModel(),
}

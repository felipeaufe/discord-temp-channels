import { MainChannelModel } from './mainChannel.model';
import { TempChannelModel } from './tempChannel.model';

export { IMainChannel } from './mainChannel.model';
export { ITempChannel } from './tempChannel.model';


/**
 * TODO: Specify which server will be operate.
 * Example:
 * new MainChannelModel(serverId);
 * or
 * db.mainChannel.defaultFilter({ server: serverId });
 */
export const db = {
  mainChannel: new MainChannelModel(),
  tempChannel: new TempChannelModel(),
}

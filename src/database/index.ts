import lowDB from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./src/database/database.json');
export const db = lowDB(adapter);

db.defaults({
  mainChannel: [],
  tempChannel: [],
  cleanChannel: []
}).write();
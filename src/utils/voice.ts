import { VoiceConnection } from '@discordjs/voice';
import { Queue } from '../types/music';

class Voice {
  _connection: VoiceConnection | undefined = undefined;
  _resourceQueue: Queue | undefined = undefined;

  set connection(connection: VoiceConnection) {this.connection = connection};
  set resourceQueue(queue: Queue) {this._resourceQueue = queue}
}

const voice = new Voice();

export default voice;

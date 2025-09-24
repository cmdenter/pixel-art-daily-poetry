import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from '../../../src/declarations/backend/index.js';

const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });

export const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});



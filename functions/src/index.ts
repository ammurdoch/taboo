import * as functions from 'firebase-functions';
import * as  admin from 'firebase-admin';
import configureServer from './server';

admin.initializeApp({
  projectId: 'check-supply',
});

const server = configureServer();

export const api = functions.https.onRequest(server);

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import configureServer from './server';
import processWebhook from './lob-webhooks';
import { onCreateResize } from './resolvers/images/on-create-resize';

admin.initializeApp({
  projectId: 'check-supply',
  storageBucket: 'check-supply.appspot.com',
});

const server = configureServer();

export const api = functions.https.onRequest(server);
export const lob_webhook = functions.https.onRequest(processWebhook);
export const onImageCreateResize = functions.firestore
  .document('images/{docId}')
  .onCreate(onCreateResize);

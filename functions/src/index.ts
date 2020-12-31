import * as functions from 'firebase-functions';
import * as  admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const jose = require('jose');

export const generateKeypair = functions.https.onCall(async (data, context) => {
  functions.logger.info(data, {structuredData: true});

  if (!context || !context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'You must sign in to use this function');
  }

  // getting dest email by query string
  const { serialNo } = data;

  const key = await jose.JWK.generate('OKP', 'Ed25519');
  const db = admin.firestore();
  try {
    await db
      .collection('deployments')
      .doc(serialNo)
      .update({
        keypair: JSON.stringify(key.toJWK(true)),
      });
    return {
      success: true,
    }
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', 'There was an error generating the keypair');
  }
});

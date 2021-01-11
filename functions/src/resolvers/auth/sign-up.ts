import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const signUpResolver = async (_: any, data: any, { dataSources }: any) => {
  functions.logger.info(data, { structuredData: true });

  // getting dest email by query string
  const { uid, email, password } = data;

  const db = admin.firestore();
  {
    let userDoc;
    try {
      userDoc = await db.collection('users').doc(uid).get();
    } catch (err) {
      functions.logger.error(err);
      throw new functions.https.HttpsError(
        'internal',
        'There was an error creating user account',
      );
    }
    if (userDoc.exists) {
      functions.logger.info(`User with id: ${uid} already exists`);
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Failed to create user',
      );
    }
  }

  const auth = admin.auth();
  let userRecord;
  try {
    userRecord = await auth.createUser({
      uid: uid,
      email,
      emailVerified: false,
      password,
      disabled: false,
    });
    functions.logger.log('Successfully created new user:', userRecord.uid);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', `Error: ${err.message}`);
  }

  try {
    const userDoc = {
      displayName: '',
      createdBy: uid,
      createdAt: new Date().toISOString(),
      updatedBy: uid,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('users').doc(uid).set(userDoc);
    return {
      ...userRecord,
      ...userDoc,
    };
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error creating user account',
    );
  }
};

export default signUpResolver;

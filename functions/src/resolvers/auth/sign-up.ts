import * as functions from 'firebase-functions';
import * as  admin from 'firebase-admin';


const signUpResolver = async (_: any, data: any, { dataSources }: any) => {
  functions.logger.info(data, {structuredData: true});

  // getting dest email by query string
  const { uuid, email, password } = data;

  const db = admin.firestore();
  let userDoc;
  try {
    userDoc = await db
      .collection('users')
      .doc(uuid)
      .get();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', 'There was an error creating user account');
  }
  if (userDoc.exists) {
    functions.logger.info(`User with id: ${uuid} already exists`);
    throw new functions.https.HttpsError('invalid-argument', 'Failed to create user');
  }

  const auth = admin.auth();
  let userRecord;
  try {
    userRecord = await auth.createUser({
      uid: uuid,
      email,
      emailVerified: false,
      password,
      disabled: false,
    });
    functions.logger.log('Successfully created new user:', userRecord.uid);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', 'There was an error creating user account');
  }

  try {
    await db
      .collection('users')
      .doc(uuid)
      .set({
        name: '',
      });
    return {
      name: '',
      email,
    }
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', 'There was an error creating user account');
  }
};

export default signUpResolver;

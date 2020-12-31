import * as functions from 'firebase-functions';
import * as  admin from 'firebase-admin';


const signUpResolver = async (_: any, data: any, { dataSources }: any) => {
  functions.logger.info(data, {structuredData: true});

  // getting dest email by query string
  const { uuid, email, password } = data;

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

  const db = admin.firestore();
  try {
    await db
      .collection('users')
      .doc(uuid)
      .update({
        name: '',
      });
    return {
      success: true,
    }
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', 'There was an error generating the keypair');
  }
};

export default signUpResolver;

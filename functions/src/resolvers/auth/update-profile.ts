import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const updateProfileResolver = async (_: any, data: any, context: any) => {
  functions.logger.info(data, { structuredData: true });

  const { profile } = data;

  if (!context.user) {
    functions.logger.info(
      `Unauthenticated user tried to modify ${profile.uid}'s profile`,
    );
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  if (profile.uid !== context.user.uid) {
    functions.logger.info(
      `User ${context.user.uid} tried to modify ${profile.uid}'s profile`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Not allowed');
  }

  const auth = admin.auth();
  try {
    await auth.getUser(profile.uid);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Failed to fetch user',
    );
  }

  const db = admin.firestore();

  const { uid, name, email, phoneNumber, ...docProps } = profile;
  let userRecord;
  try {
    userRecord = await auth.updateUser(uid, {
      email,
      phoneNumber,
      displayName: name,
    });
    functions.logger.log('Successfully created new user:', userRecord.uid);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError('internal', `Error: ${err.message}`);
  }

  try {
    await db
      .collection('users')
      .doc(uid)
      .update({
        name,
        ...docProps,
        updatedAt: new Date().toISOString(),
        updatedBy: context.user.uid,
      });
    const userDoc = await db.collection('users').doc(uid).get();
    const profileWithUser = {
      ...userRecord,
      ...userDoc.data(),
    };
    functions.logger.log(profileWithUser, { structuredData: true });
    return profileWithUser;
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error creating user account',
    );
  }
};

export default updateProfileResolver;

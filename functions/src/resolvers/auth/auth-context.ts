import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const authContext = async ({ req }: any) => {
  const token = req.headers.authorization;
  if (!token) {
    return {};
  }

  const parts = token.split(' ');
  let bearer;
  if (parts.length === 2) {
    bearer = parts[1];
  }

  if (!bearer) {
    return {};
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(bearer);
  } catch (err) {
    functions.logger.info(`Failed to authenticate: ${err.message}`);
  }
  if (!decodedToken) {
    return {};
  }

  const { uid } = decodedToken;
  let user;
  try {
    user = await admin.auth().getUser(uid);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      `Error fetching user: ${err.message}`,
    );
  }
  const db = admin.firestore();
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      user = {
        ...user,
        ...userDoc.data(),
      };
    }
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      `Error fetching profile: ${err.message}`,
    );
  }

  return { user };
};

export default authContext;

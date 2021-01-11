import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const profilePicResolver = async (
  profile: any,
  data: any,
  context: any,
) => {
  functions.logger.info(data, { structuredData: true });

  const { profilePicId } = profile;

  if (!profilePicId) {
    return undefined;
  }

  if (!context.user) {
    functions.logger.info(`profilePicResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();

  let doc;
  try {
    doc = await db.collection('images').doc(profilePicId).get();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error fetching profile pic',
    );
  }

  if (!doc.exists) {
    return null;
  }

  const profilePic: any = doc.data();
  if (!profilePic.permissions.includes('anyone-can-read')) {
    functions.logger.info(
      `User ${context.user.uid} tried to access profile pic ${profilePic.id} which has permissions ${profilePic.permissions}`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Forbidden');
  }

  return profilePic;
};

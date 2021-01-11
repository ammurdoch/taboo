import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createImageResolver = async (_: any, data: any, context: any) => {
  functions.logger.info(data, { structuredData: true });

  const { image } = data;

  if (!context.user) {
    functions.logger.info(`createImageResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  // TODO: Do something with the routing and account numbers
  const db = admin.firestore();
  const { id, filename, desc, original, tags, permissions } = image;
  const imageObj = {
    id,
    filename,
    desc,
    original,
    tags,
    permissions,
    createdBy: context.user.uid,
    createdAt: new Date().toISOString(),
    updatedBy: context.user.uid,
    updatedAt: new Date().toISOString(),
  };
  try {
    await db.collection('images').doc(imageObj.id).set(imageObj);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error creating image',
    );
  }

  return imageObj;
};

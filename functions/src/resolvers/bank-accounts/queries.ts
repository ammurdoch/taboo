import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { convertSnapshotToCollection, getPageParams } from '../../util/relay';

export const allBankAccountsResolver = async (
  _: any,
  data: any,
  context: any,
) => {
  functions.logger.info(data, { structuredData: true });
  let startAfter;
  let limit;
  const { first, after } = data;
  if (first && after) {
    ({ startAfter, limit } = getPageParams(first, after));
  } else {
    startAfter = null;
    limit = 100;
  }

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();

  try {
    let snapshot;
    if (startAfter) {
      snapshot = await db
        .collection('bankAccounts')
        .where('owner', '==', context.user.uid)
        .orderBy('id')
        .startAfter(startAfter);
    } else {
      snapshot = await db
        .collection('bankAccounts')
        .where('owner', '==', context.user.uid)
        .orderBy('id');
    }
    snapshot = await snapshot.limit(limit).get();
    return convertSnapshotToCollection(snapshot, startAfter, limit);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error querying bank accounts',
    );
  }
};

export const bankAccountResolver = async (_: any, data: any, context: any) => {
  functions.logger.info(data, { structuredData: true });

  const { id } = data;

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();

  let doc;
  try {
    doc = await db.collection('bankAccounts').doc(id).get();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error fetching bank account',
    );
  }

  if (!doc.exists) {
    return null;
  }

  const bankAccount: any = doc.data();
  if (bankAccount.owner !== context.user.uid) {
    functions.logger.info(
      `User ${context.user.uid} tried to access bankAccount ${bankAccount.id} which is owned by ${bankAccount.owner}`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Forbidden');
  }

  return bankAccount;
};

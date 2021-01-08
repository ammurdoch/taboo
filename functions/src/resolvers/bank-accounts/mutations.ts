import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createBankAccountResolver = async (
  _: any,
  data: any,
  context: any,
) => {
  functions.logger.info(data, { structuredData: true });

  const { bankAccount } = data;

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  if (context.user.uid !== bankAccount.owner) {
    functions.logger.info(
      `User ${context.user.uid} tried to create a bankAccount ${bankAccount.id} owned by ${bankAccount.owner}`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Forbidden');
  }

  // TODO: Do something with the routing and account numbers

  const db = admin.firestore();
  const { id, label } = bankAccount;
  const bankAccountObj = {
    id,
    label,
    verificationStatus: 'not-verified',
    createdBy: context.user.uid,
    createdAt: new Date().toISOString(),
    updatedBy: context.user.uid,
    updatedAt: new Date().toISOString(),
  };
  try {
    await db.collection('bankAccounts').doc(bankAccount.id).set(bankAccountObj);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error creating bank account',
    );
  }

  return bankAccountObj;
};

export const updateBankAccountResolver = async (
  _: any,
  data: any,
  context: any,
) => {
  functions.logger.info(data, { structuredData: true });

  const { bankAccount } = data;

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();
  let bankAccountDoc;
  try {
    bankAccountDoc = await db
      .collection('bankAccounts')
      .doc(bankAccount.id)
      .get();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error fetching bank account',
    );
  }

  if (!bankAccountDoc.exists) {
    functions.logger.error(`Bank account ${bankAccount.id} doesn't exist`);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error updating bank account',
    );
  }

  let bankAccountObj: any = bankAccountDoc.data();

  if (context.user.uid !== bankAccountObj.owner) {
    functions.logger.info(
      `User ${context.user.uid} tried to update a bankAccount ${bankAccountObj.id} owned by ${bankAccountObj.owner}`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Forbidden');
  }

  bankAccountObj = {
    ...bankAccountObj,
    ...bankAccount,
    updatedBy: context.user.uid,
    updatedAt: new Date().toISOString(),
  };
  try {
    await db.collection('bankAccounts').doc(bankAccount.id).set(bankAccountObj);
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error updating bank account',
    );
  }

  return bankAccountObj;
};

export const deleteBankAccountResolver = async (
  _: any,
  data: any,
  context: any,
) => {
  functions.logger.info(data, { structuredData: true });

  const { bankAccountId } = data;

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  const db = admin.firestore();
  let bankAccountDoc;
  try {
    bankAccountDoc = await db
      .collection('bankAccounts')
      .doc(bankAccountId)
      .get();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error fetching bank account',
    );
  }

  if (!bankAccountDoc.exists) {
    functions.logger.error(`Bank account ${bankAccountId} doesn't exist`);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error updating bank account',
    );
  }

  const bankAccountObj: any = bankAccountDoc.data();

  if (context.user.uid !== bankAccountObj.owner) {
    functions.logger.info(
      `User ${context.user.uid} tried to update a bankAccount ${bankAccountObj.id} owned by ${bankAccountObj.owner}`,
    );
    throw new functions.https.HttpsError('permission-denied', 'Forbidden');
  }

  try {
    await db.collection('bankAccounts').doc(bankAccountId).delete();
  } catch (err) {
    functions.logger.error(err);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error updating bank account',
    );
  }

  return bankAccountId;
};

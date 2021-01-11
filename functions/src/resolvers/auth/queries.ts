import * as functions from 'firebase-functions';

export const profileResolver = async (_: any, data: any, context: any) => {
  functions.logger.info(data, { structuredData: true });

  if (!context.user) {
    functions.logger.info(`allBanksResolver: Unauthenticated user`);
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
  }

  return context.user;
};

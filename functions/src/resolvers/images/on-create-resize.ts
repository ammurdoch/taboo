import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import sharp from 'sharp';

const sizes = {
  lg: {
    width: 1920,
    height: 1080,
  },
  md: {
    width: 640,
    height: 480,
  },
  sm: {
    width: 200,
    height: 200,
  },
};

export async function onCreateResize(
  snapshot: QueryDocumentSnapshot,
  context: functions.EventContext,
) {
  functions.logger.info(snapshot, { structuredData: true });

  const imageNode = snapshot.data();
  const srcS3Key = imageNode.original.s3Key;

  const bucket = admin.storage().bucket();

  let imgContents;
  try {
    const imgData = await bucket.file(srcS3Key).download();
    imgContents = imgData[0];
  } catch (err) {
    functions.logger.error(err);
    throw new Error(`Failed to resize image: ${err.message}`);
  }

  const db = admin.firestore();

  try {
    const sharpImage = sharp(imgContents);
    const metadata: any = await sharpImage.metadata();
    functions.logger.info('metadata', metadata);

    const dbUpdate: any = {};
    for (const [name, size] of Object.entries(sizes)) {
      const filename = `${imageNode.id}-${name}.jpg`;
      const s3Key = `images/${filename}`;
      const path = `/tmp/${filename}`;
      const info = await sharp(imgContents)
        .jpeg()
        .resize(
          Math.min(size.width, metadata.width),
          Math.min(size.height, metadata.height),
        )
        .toFile(path);
      await bucket.upload(path, {
        destination: s3Key,
      });
      functions.logger.info(
        `Resized ${srcS3Key} image to ${size.width} x ${size.height} and stored it to ${s3Key}`,
      );
      dbUpdate[name] = {
        s3Key,
        size: info.size,
        filename,
        contentType: 'image/jpeg',
      };
    }

    await db
      .collection('images')
      .doc(imageNode.id)
      .update({
        ...dbUpdate,
        updatedAt: new Date().toISOString(),
      });
  } catch (err) {
    functions.logger.error(err);
    throw new Error(`Failed to resize image: ${err.message}`);
  }
}

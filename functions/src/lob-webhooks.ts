// eslint-disable-next-line no-redeclare
import { Request, Response } from 'express';
import sendEmail from './util/email';

const functions = require('firebase-functions');
const moment = require('moment');
const CryptoJS = require('crypto-js');

async function verify_webhook(req: Request) {
  const headers = req.headers;
  const lobSignature = headers['lob-signature'];
  const lobTimestamp: any = headers['lob-signature-timestamp'];
  const secret = functions.config().lob.webhook_secret;

  const body = req.body;
  const preHash = lobTimestamp + '.' + JSON.stringify(body);
  const hash = CryptoJS.HmacSHA256(preHash, secret);

  const timestamp = Date.now();
  const latency = timestamp - parseInt(lobTimestamp);
  const isEqual = hash.toString() === lobSignature;

  if (!isEqual || latency >= 300000) {
    functions.logger.error('Hash:', hash.toString());
    functions.logger.error('lobSignature:', lobSignature);
    functions.logger.error('isEqual:', isEqual);
    functions.logger.error('latency:', latency);
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Webhook verification failed',
    );
  }
}

async function process_webhook(data: any) {
  // TODO: Typing
  const expected_delivery = await moment(
    data.body.expected_delivery_date,
    'YYYY-MM-DD',
  ).format('dddd, MMMM Do YYYY');
  const check_number = data.body.check_number;
  const webhook_type = data.event_type.id;
  let message;
  let subject = 'check.supply ◼️ Update on check #' + check_number;

  switch (webhook_type) {
    case 'check.created':
      message =
        'We wanted to let you know that your check #' +
        check_number +
        ' has been created and is currently printing for delivery. The expected delivery date is ' +
        expected_delivery +
        '.';
      break;
    case 'check.deleted':
      message =
        'Your check has been successfully cancelled. Reference #: ' +
        data.body.id +
        '.';
      subject = 'CheckIt — Your check has been cancelled: ' + data.body.id;
      break;
    case 'check.in_transit':
      message =
        'Check #' +
        check_number +
        ' is currently in transit to ' +
        data.body.to.address_line1 +
        '.';
      break;
    case 'check.processed_for_delivery':
      message =
        'Good news! Check #' +
        check_number +
        ' has been processed and is expected to be delivered on ' +
        expected_delivery +
        '.';
      break;
    case 'check.re-routed':
      message =
        'Check #' +
        check_number +
        ' has been re-routed due to recipient change of address, address errors, or USPS relabeling of barcode/ID tag area.';
      break;
    case 'check.returned_to_sender':
      message =
        'Check #' +
        check_number +
        ' is being returned to sender due to barcode, ID tag area, or address errors.';
      break;
    case 'check.in_local_area':
      message =
        'Check #' +
        check_number +
        ' is being processed at the destination shipping facility.';

    default:
      functions.logger.warning(
        `Received unexpected webhook_type ${webhook_type}`,
      );
      return;
  }

  await sendEmail('pfista@gmail.com', subject, message);
}

async function processWebhook(req: Request, resp: Response) {
  try {
    await verify_webhook(req);
    await process_webhook(req.body);
  } catch (err) {
    functions.logger.error(err);
    resp.sendStatus(500);
    return;
  }

  resp.sendStatus(200);
}

export default processWebhook;

const functions = require('firebase-functions');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(functions.config().sendgrid.api_key);

async function sendEmail(to: String, subject: String, message: String) {
  const msg = {
    to: to,
    from: functions.config().sendgrid.from_address,
    templateId: 'd-17df8fd3e18e4157b28f1e7f3355570e',
    dynamic_template_data: {
      subject: subject,
      message: message
  }};

  return await sendgrid.send(msg);
}
  
export default sendEmail;
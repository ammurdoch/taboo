import * as firebase from 'firebase/app';
import { notification } from 'antd';
import { generateKeypair } from './firebase-functions';

async function handleKeypairAction(record, action) {
  switch (action) {
    case 'generate':
      {
        try {
          const response = await generateKeypair({
            serialNo: record.serialNo,
          });
          console.log('response', response);
          notification.open({
            message: 'Keypair Generated',
            description: `Generated private-public keypair for deployment "${record.serialNo}"`,
          });
        } catch (err) {
          notification.open({
            message: 'Error Generating Keypair',
            description: err.message,
          });
        }
      }
      break;
    case 'public':
      {
        let key = JSON.parse(record.keypair);
        delete key.d;
        key = JSON.stringify(key);
        key = `data:text/json;charset=utf-8,${encodeURIComponent(key)}`;
        const a = document.createElement('a');
        a.href = key;
        a.download = `${record.serialNo}-public-key.json`;
        a.click();
      }
      break;
    case 'private':
      {
        let key = record.keypair;
        key = `data:text/json;charset=utf-8,${encodeURIComponent(key)}`;
        const a = document.createElement('a');
        a.href = key;
        a.download = `${record.serialNo}-private-key.json`;
        a.click();
      }
      break;
    case 'delete':
      {
        const db = firebase.firestore();
        try {
          await db.collection('deployments').doc(record.serialNo).update({
            keypair: null,
          });
          notification.open({
            message: 'Keypair Deleted',
            description: `Deleted private-public keypair for deployment "${record.serialNo}"`,
          });
        } catch (err) {
          notification.open({
            message: 'Error Deleting Keypair',
            description: err.message,
          });
        }
      }
      break;
    default:
      break;
  }
}

export default handleKeypairAction;

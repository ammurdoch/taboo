import * as React from 'react';
import firebase from 'firebase';

function useNoteDetails(authContext, uuid, setLoading, setErrorMsg) {
  const [note, setNote] = React.useState();
  React.useEffect(() => {
    async function asyncBootstrap() {
      setLoading(true);
      const db = firebase.firestore();
      try {
        await db
          .collection('notes')
          .doc(uuid)
          .onSnapshot((doc) => {
            setNote(doc.data() || null);
          });
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (uuid && authContext.state.user) {
      asyncBootstrap();
    }
  }, [authContext.state.user, setErrorMsg, setLoading, uuid]);
  return note;
}

export default useNoteDetails;

import * as React from 'react';
import * as firebase from 'firebase';

function useDeploymentDetails(authContext, serialNo, setLoading, setErrorMsg) {
  const [deployment, setDeployment] = React.useState();
  React.useEffect(() => {
    async function asyncBootstrap() {
      setLoading(true);
      const db = firebase.firestore();
      try {
        db.collection('deployments')
          .doc(serialNo)
          .onSnapshot((doc) => {
            setDeployment(doc.data() || null);
          });
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (serialNo && authContext.state.user) {
      asyncBootstrap();
    }
  }, [authContext.state.user, setErrorMsg, setLoading, serialNo]);
  return deployment;
}

export default useDeploymentDetails;

import * as React from 'react';
import * as firebase from 'firebase';

const initialState = {
  loading: false,
  errorMsg: '',
  notes: null,
  nextCursor: null,
  deploymentSerialNo: '',
  hasMore: true,
};

function notesReducer(state, action) {
  console.log('notes', state, action);
  switch (action.type) {
    case 'start-query':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'pagination-query':
      if (action.deploymentSerialNo !== state.deploymentSerialNo) {
        return {
          loading: false,
          errorMsg: '',
          notes: action.data,
          nextCursor: action.nextCursor,
          deploymentSerialNo: action.deploymentSerialNo,
          hasMore: !!action.data.length,
        };
      }
      return {
        loading: false,
        errorMsg: '',
        notes: [...(state.notes || []), ...action.data],
        nextCursor: action.nextCursor,
        deploymentSerialNo: action.deploymentSerialNo,
        hasMore: !!action.data.length,
      };
    case 'query-error':
      return {
        ...state,
        loading: false,
        errorMsg: (action.error && action.error.message) || '',
      };
    case 'change-create':
      if (action.deploymentSerialNo === state.deploymentSerialNo) {
        return {
          ...state,
          notes: [action.data, ...(state.notes || [])],
          deploymentSerialNo: action.deploymentSerialNo,
        };
      }
      return {
        ...state,
        notes: [action.data],
        deploymentSerialNo: action.deploymentSerialNo,
      };
    case 'change-update':
      if (
        action.deploymentSerialNo === state.deploymentSerialNo &&
        state.notes
      ) {
        const index = state.notes.findIndex((t) => t.uuid === action.data.uuid);
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            action.data,
            ...state.notes.slice(index + 1),
          ],
          deploymentSerialNo: action.deploymentSerialNo,
        };
      }
      return state;
    case 'change-delete':
      if (
        action.deploymentSerialNo === state.deploymentSerialNo &&
        state.notes
      ) {
        return {
          ...state,
          notes: state.notes.filter((t) => t.uuid !== action.data.uuid),
          deploymentSerialNo: action.deploymentSerialNo,
        };
      }
      return state;
    default:
      return state;
  }
}

export default function useNotes(deploymentSerialNo, user) {
  const [state, dispatch] = React.useReducer(
    notesReducer,
    initialState,
    () => initialState,
  );

  const doQuery = React.useCallback(
    async (limit, cursor) => {
      if (user) {
        dispatch({
          type: 'start-query',
          deploymentSerialNo,
        });
        const db = firebase.firestore();
        try {
          const query = db
            .collection('notes')
            .where('deploymentSerialNo', '==', deploymentSerialNo)
            .orderBy('updatedAt', 'desc');
          let querySnapshot;
          if (cursor) {
            querySnapshot = await query.startAfter(cursor).limit(limit).get();
          } else {
            querySnapshot = await query.limit(limit).get();
          }
          const _notes = [];
          let _cursor = null;
          querySnapshot.forEach((doc) => {
            _notes.push(doc.data());
            _cursor = doc;
          });
          dispatch({
            type: 'pagination-query',
            data: _notes,
            deploymentSerialNo,
            nextCursor: _cursor,
          });
        } catch (err) {
          dispatch({
            type: 'query-error',
            deploymentSerialNo,
            error: err,
          });
        }
      }
    },
    [user, deploymentSerialNo],
  );

  React.useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('notes')
        .where('deploymentSerialNo', '==', deploymentSerialNo)
        .orderBy('updatedAt', 'desc')
        .onSnapshot(function (snapshot) {
          snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
              dispatch({
                type: 'change-create',
                data: change.doc.data(),
                deploymentSerialNo,
              });
            }
            if (change.type === 'modified') {
              dispatch({
                type: 'change-update',
                data: change.doc.data(),
                deploymentSerialNo,
              });
            }
            if (change.type === 'removed') {
              dispatch({
                type: 'change-delete',
                data: change.doc.data(),
                deploymentSerialNo,
              });
            }
          });
        });
      return () => unsubscribe();
    }
  }, [deploymentSerialNo, user]);

  return {
    doQuery,
    loading: state.loading,
    errorMsg: state.errorMsg,
    notes: state.notes,
    nextCursor: state.nextCursor,
    hasMore: state.hasMore,
  };
}

import * as React from 'react';
import * as firebase from 'firebase/app';
import settings from '../../settings';

const initialState = {
  loading: false,
  errorMsg: '',
  deployments: null,
  nextCursor: null,
  hasMore: true,
};

function deploymentsReducer(state, action) {
  console.log('deployments', state, action);
  switch (action.type) {
    case 'start-query':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'pagination-query':
      return {
        loading: false,
        errorMsg: '',
        deployments: [...(state.deployments || []), ...action.data],
        nextCursor: action.nextCursor,
        hasMore: !!action.data.length,
      };
    case 'query-error':
      return {
        ...state,
        loading: false,
        errorMsg: (action.error && action.error.message) || '',
      };
    case 'change-create':
      return {
        ...state,
        deployments: [action.data, ...(state.deployments || [])],
      };
      return state;
    case 'change-update':
      if (state.deployments) {
        const index = state.deployments.findIndex(
          (t) => t.serialNo === action.data.serialNo,
        );
        return {
          ...state,
          deployments: [
            ...state.deployments.slice(0, index),
            action.data,
            ...state.deployments.slice(index + 1),
          ],
        };
      }
      return state;
    case 'change-delete':
      if (state.deployments) {
        return {
          ...state,
          deployments: state.deployments.filter(
            (t) => t.serialNo !== action.data.serialNo,
          ),
        };
      }
      return state;
    default:
      return state;
  }
}

export default function useDeployments(user) {
  const [state, dispatch] = React.useReducer(
    deploymentsReducer,
    initialState,
    () => initialState,
  );

  const doQuery = React.useCallback(
    async (limit, cursor) => {
      if (user) {
        dispatch({
          type: 'start-query',
        });
        const db = firebase.firestore();
        try {
          const query = db
            .collection('deployments')
            .orderBy('customerName', 'desc');
          let querySnapshot;
          if (cursor) {
            querySnapshot = await query.startAfter(cursor).limit(limit).get();
          } else {
            querySnapshot = await query.limit(limit).get();
          }
          const _deployments = [];
          let _cursor = null;
          querySnapshot.forEach((doc) => {
            _deployments.push(doc.data());
            _cursor = doc;
          });
          dispatch({
            type: 'pagination-query',
            data: _deployments,
            nextCursor: _cursor,
          });
        } catch (err) {
          dispatch({
            type: 'query-error',
            error: err,
          });
        }
      }
    },
    [user],
  );

  React.useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('deployments')
        .orderBy('customerName', 'desc')
        .onSnapshot(function (snapshot) {
          snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
              dispatch({
                type: 'change-create',
                data: change.doc.data(),
              });
            }
            if (change.type === 'modified') {
              dispatch({
                type: 'change-update',
                data: change.doc.data(),
              });
            }
            if (change.type === 'removed') {
              dispatch({
                type: 'change-delete',
                data: change.doc.data(),
              });
            }
          });
        });
      return () => unsubscribe();
    }
  }, [user]);

  return {
    doQuery,
    loading: state.loading,
    errorMsg: state.errorMsg,
    deployments: state.deployments,
    nextCursor: state.nextCursor,
    hasMore: state.hasMore,
  };
}

const settings = {
  pageSize: 10,
  apiUrl:
    process.env.REACT_APP_API_URL ||
    'https://us-central1-check-supply.cloudfunctions.net/api/graphql/',
  apiWsUrl:
    process.env.REACT_APP_API_WS_URL ||
    'ws://us-central1-check-supply.cloudfunctions.net/api/graphql',
};

export default settings;

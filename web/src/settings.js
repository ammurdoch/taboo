const settings = {
  pageSize: 10,
  apiUrl:
    process.env.REACT_APP_API_URL ||
    'http://localhost:5001/check-supply/us-central1/api/graphql/',
};

export default settings;

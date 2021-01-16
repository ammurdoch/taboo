# Taboo

# Project Structure

```
/
/functions/
/web/
```

- `root`: firebase settings
- `functions`: backend firebase functions
- `web`: frontend web app

# Tech Stack
## Frontend
- ReactJS
- Ant Design
- Apollo GraphQL
- Redux

# Steps to deploy

1. Build and deploy frontend
```
cd web
yarn install
yarn build
firebase deploy --only hosting
```

# Running locally
1. Frontend
```
cd web
yarn install
yarn start
```

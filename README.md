# This is internship project of Sergey Ogarkov
## Project overview
This project is based on React framwork. Run 'npm i' to install related dependencies

## Project commands
'npm run build' compiles production version of the application to the .\dist folder
'npm run dev' start running the app on webpack development server (frontend)
'npm run devsrv' start running backend side in development mode

Use http://localhost:8080/ to open the app while webpack development server is up and running.
Use http://localhost:3001/ to open the app while backend side is up and running.

## Deployment from the scratch
Install all dependencies
Install Postgree SQL
Create and modify the following config files as shown in example ones:
.src/backend/.env
.src/backend/config/sequelize-cli/config.json
.src/frontend/env.js
Create database
Build frontend part '$ npm run build'
Start backend '$ npm run devsrv'
Follow http://localhost:3001/ link to open the app
Fill in currencies table by running script ./cli/currencies.sql in any DB manager
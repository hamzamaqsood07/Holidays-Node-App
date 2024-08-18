# Holidays-Node-App

The Holidays-Node-App powered by typescript provides RESTful APIs to client applications regarding holidays of different countries.

## Project Setup

### 1. Clone the Repository
Using https
```bash
git clone https://github.com/yourusername/Holidays-Node-App.git
```
Or using ssh
```bash
git clone git@github.com:hamzamaqsood07/Holidays-Node-App.git
```
Then
```bash
cd Holidays-Node-App
```


### 2. Install dependencies
Make sure you have node 20 installed then run:
```bash
npm install
```

### 3. Set Environement
create .env from .env.sample

### 4. Run Server
If you wish to run on dev mode:
```bash
npm run dev
```
If you wish to run production build:
```bash
npm run build
npm run start
```
### 5. Format your code
To format your code using prettier, run following command
```bash
npm run format
```


## Project Structure
### Root Directory
- src directory contains all source files (typescript)
- dist directory will contain the trascompiled js files (build) after running build script.
- config directory contains configuration jsons for different environments.
- prettier is configured, .prettierrc is configuration of prettier, .prettierignore lists files that will be ignored by prettier
- tsconfig.json describes typescript configuration of the project
- nodemon.json describes nodemon configuration to run project on development mode

### src Directory
- index.ts is the entry file which run server on the specified port.
- startup directory has initial responsibilities like checkking required environment variables.
- routes directory contains all routes.
    - each file is a router of a specific path i.e., '/holidays'


## APIs
### GET /countries
### GET /holidays?country=US&year=2024
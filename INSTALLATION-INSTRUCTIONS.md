## Getting started

#### Step 1: Clone the repository

```bash
git clone https://github.com/KeylaFrancoH/invoice-proyect.git
```

```bash
cd invoice-proyect
```

#### Step 2: Create Your MySQL Account and Databases

- Create your own MySQL account by visiting the MySQL website and signing up for a new account.

- Create a new database or cluster by following the instructions provided in the MySQL documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change `<password>` with your own password

- add your current IP address to the MySQL database's IP whitelist to allow connections (this is needed whenever your ip changes)

#### Step 3: Edit the Environment File

- Check a file named .env in the /backend directory.

  This file will store environment variables for the project to run.

#### Step 4: Update MySQL

Replace the data to connect MySQL with your own information.

#### Step 5: Install Backend Dependencies

In your terminal, navigate to the /backend directory

```bash
cd backend
```

the urn the following command to install the backend dependencies:

```bash
npm install
```
This command will install all the required packages specified in the package.json file.

Also, you must install:

```bash
npm install nodemon
```
```bash
npm install cors
```
```bash
npm install -g sequelize-cli
npm install --save sequelize mysql2
sequelize init
```
```bash
Modify the file `config/config.json` with the connection data for the database engine. In this case, use the development environment.

{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  ...
```


#### Step 6: Run the Backend Server

In the same terminal, run the following command to start the backend server:

```bash
npm run server
```

This command will start the backend server, and it will listen for incoming requests. It will be open on localhost:8081

#### Step 7: Install Frontend Dependencies

Open a new terminal window , and run the following command to install the frontend dependencies:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm install bootstrap
```

```bash
npm install react-bootstrap
```

```bash
npm install react-router-dom
```


#### Step 8: Run the Frontend Server

After installing the frontend dependencies, run the following command in the same terminal to start the frontend server:

```bash
npm run start
```

This command will start the frontend server, and you'll be able to access the website on localhost:3000 in your web browser.


You have to use;

- > Node.js v16.20.0


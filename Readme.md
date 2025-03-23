# Project Setup Instructions

This project consists of a Node.js backend and a React frontend. The backend handles the server-side logic and database interactions, while the frontend provides the user interface.

## Project Structure

* `backend`: Contains the Node.js server-side code.
* `frontend`: Contains the React client-side code.
* `Database backup`: Contains the database backup file (`DatabaseDump.sql`).

## Database Setup

You have two options for setting up the database:

### Option 1: Using the Database Dump (Recommended)

1.  **Install MySQL Server and MySQL Workbench:**

    * Download and install MySQL Server from [MySQL Downloads](https://dev.mysql.com/downloads/).
    * During installation, set a root password and remember it.
    * Install MySQL Workbench.

2.  **Restore the Database:**

    * Open MySQL Workbench.
    * Connect to your local MySQL server using the root password you set.
    * Create a new schema (e.g., named `CFP`).
    * Right-click on the newly created schema and select "Table Data Import Wizard".
    * Select the `DatabaseDump.sql` file located in the `Database backup` directory.
    * Follow the wizard to import the data.

### Option 2: Creating the Database and Tables Manually

1.  **Install MySQL Server and MySQL Workbench:**

    * Download and install MySQL Server from [MySQL Downloads](https://dev.mysql.com/downloads/).
    * During installation, set a root password and remember it.
    * Install MySQL Workbench.

2.  **Create the Database and Tables:**

    * Open MySQL Workbench.
    * Connect to your local MySQL server.
    * Run the following SQL commands:

    ```sql
    DROP DATABASE IF EXISTS CFP;
    CREATE DATABASE CFP;
    USE CFP;

    CREATE TABLE Category(
        Topic VARCHAR(255) PRIMARY KEY NOT NULL
    );

    CREATE TABLE Person(
        PersonID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Name VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        Role ENUM('Author', 'Editor', 'Reviewer') NOT NULL,
        Affiliation VARCHAR(255) NOT NULL,
        Phone_Number CHAR(10) NOT NULL,
        Hashed_Password VARCHAR(255) NOT NULL,
        CHECK (CHAR_LENGTH(Phone_Number) = 10)
    );

    CREATE TABLE Conference(
        Conference_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Name VARCHAR(255) NOT NULL,
        Theme VARCHAR(255) NOT NULL,
        Location VARCHAR(255) NOT NULL,
        Start_Date DATE NOT NULL,
        End_Date DATE NOT NULL
    );

    CREATE TABLE CFP(
        CFP_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Title VARCHAR(255) NOT NULL,
        Announced_Date DATE NOT NULL,
        Submission_Deadline DATE NOT NULL,
        Paper_Count int NOT NULL default 0,
        Topic VARCHAR(255) NOT NULL,
        Conference_ID INT NOT NULL,
        FOREIGN KEY (Conference_ID) REFERENCES Conference(Conference_ID),
        FOREIGN KEY (Topic) REFERENCES Category(Topic)
    );

    CREATE TABLE Paper(
        Paper_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Title VARCHAR(100) NOT NULL,
        Topic VARCHAR(255) NOT NULL,
        FOREIGN KEY (Topic) REFERENCES Category(Topic)
    );

    CREATE TABLE Submission(
        Submission_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Submission_Date DATE NOT NULL,
        Status ENUM('Waiting', 'Approved', 'Rejected') NOT NULL,
        Paper_ID INT NOT NULL,
        CFP_ID INT NOT NULL,
        Submitted_By INT NOT NULL,
        FOREIGN KEY (Paper_ID) REFERENCES Paper(Paper_ID),
        FOREIGN KEY (CFP_ID) REFERENCES CFP(CFP_ID),
        FOREIGN KEY (Submitted_By) REFERENCES Person(PersonID)
    );

    CREATE TABLE Reviews(
        Review_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Review_Score INT NOT NULL,
        Paper_ID INT NOT NULL,
        Submission_ID INT NOT NULL,
        FOREIGN KEY (Paper_ID) REFERENCES Paper(Paper_ID),
        FOREIGN KEY (Submission_ID) REFERENCES Submission(Submission_ID),
        CHECK (Review_Score BETWEEN 0 AND 100)
    );
    ```

## Backend Setup

1.  **Update Database Configuration:**

    * Replace the database configuration in your `backend/index.js` (or relevant database connection file) with the following:

    ```javascript
    const mysql = require('mysql');

    const db = mysql.createConnection({
        host: 'localhost', // Or your MySQL host
        user: 'root', // Or your MySQL user
        password: 'your_mysql_root_password', // Replace with your MySQL root password
        database: 'CFP' // Or the name of your database
    });
    ```

    * **Important:** Replace `your_mysql_root_password` with the password you set during MySQL installation.

2.  **Install Dependencies:**

    * Open a terminal in the `backend` directory and run:

    ```bash
    npm install
    ```

3.  **Test Database Connection (Optional):**

    * Add the following code after your database configuration to verify the connection:

    ```javascript
    db.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err);
        } else {
            console.log('Database connected successfully');
        }
    });
    ```

4.  **Start the Backend:**

    * In the `backend` directory, run:

    ```bash
    node index.js 
    ```

## Frontend Setup

1.  **Install Dependencies:**

    * Open a new terminal in the `frontend` directory and run:

    ```bash
    npm install
    ```

2.  **Configure API Endpoint (If Necessary):**

    * If your frontend needs to connect to a specific backend API endpoint, make sure to configure this in your frontend code (e.g., in API service files).

3.  **Start the Frontend:**

    * In the `frontend` directory, run:

    ```bash
    npm run dev
    ```

## Important Notes

* Make sure the MySQL service is running on your system.
    * For Windows:
        * Open the Services app (search for "Services").
        * Look for "MySQL80" (or a similar name) and ensure its status is "Running".
* If you encounter any errors:
    * Check if the MySQL server is running.
    * Verify the password in the database configuration.
    * Make sure the database name matches.
    * Ensure you have all required npm packages installed.
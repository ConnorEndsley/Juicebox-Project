// grab out client with destructuring from the export in index.js
const { client, getAllUsers, createUsers } = require('./index');


// this function will call a query that will drop all tables from the database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(
            `
            DROP TABLE IF EXISTS users;
            `
        );

        console.log("Dropping tables complete!")
    }catch (error){
        console.error("Error dropping tables!")
    throw error;
    }
};


// this function call a query that creates tables in our database
async function createTables(){
    try{
        console.log("Building the best tables...")

    await client.query(
     `
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255)  NOT NULL
        );
     `
    );

    console.log("Best tables build!")
    }catch (error) {
        console.error("Oops, your tables were not built...")
     throw error
    }
};

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUsers({ username: 'albert', password: 'bertie99'});
        const sandra = await createUsers({ username: 'sandra', password: '2sandy4me' });
        const glamgal = await createUsers({ username: 'glamgal', password: 'soglam' });

        console.log(albert, sandra, glamgal);

        console.log("Finished creating user!");
    }catch(error) {
        console.log("Error creating users!")
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();
            
        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {;
        throw error;
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      const users = await getAllUsers();
      console.log("getAllUsers:", users);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  
    

  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(()=> client.end());


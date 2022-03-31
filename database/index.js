// in general the index.js will have the utility functions that the rest of the app with use


const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');


async function createUsers({ 
  username,
  password, 
  name, 
  location
  }) 
  {
    try {
      const result = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return result;
    } catch (error) {
      throw error;
    }
  }


async function getAllUsers() {
    const { rows } = await client.query(`SELECT id, username, name, location, active FROM users;`);
  
    return rows;
  }
  

module.exports = {
    client,
    getAllUsers,
    createUsers
}
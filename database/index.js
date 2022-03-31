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
      const { rows: [user]} = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }


async function getAllUsers() {
    const { rows } = await client.query(`SELECT id, username, name, location, active FROM users;`);
  
    return rows;
  }
  
  async function updateUsers(id, fields = {}){
    // first, build set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    // return the function early if called without fields
    if(setString === 0 ){
      return ;
    }

    try{
      const { rows: [user] } = await client.query(
        `
        UPDATE users
        SET ${ setString }
        WHERE id = ${ id }
        RETURNING *;
        `, Object.values(fields));
        return user;
    } catch(error){
      throw error;
    }
  };

module.exports = {
    client,
    getAllUsers,
    createUsers,
    updateUsers
}
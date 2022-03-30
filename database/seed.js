// grab out client with destructuring from the export in index.js
const { client } = require('./index');

async function testDB() {
    try {
        // connect the client to the database
        client.connect();

        // query, so use await
        const result = await client.query('SELECT * FROM users;');

        //console.log to see results
        console.log(results);
    } catch (error) {
        console.error(error);
    } finally {
        client.end();
    }
}

testDB();
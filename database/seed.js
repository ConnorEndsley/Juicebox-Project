// grab out client with destructuring from the export in index.js
const { client, 
    getAllUsers, 
    createUsers, 
    updateUsers, 
    createPost, 
    updatePost,
    getAllPosts,
    getUserById,
    addTagsToPost,
    createTags,
    createPostTag } = require('./index');


// this function will call a query that will drop all tables from the database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(
            `
            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);

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
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255)  NOT NULL,
            name VARCHAR(225) NOT NULL,
            location VARCHAR(225) NOT NULL,
            active BOOLEAN DEFAULT true
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );

        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE post_tags(
            "postId" INTEGER REFERENCES posts(id) UNIQUE NOT NULL,
            "tagId" INTEGER REFERENCES tags(id) UNIQUE NOT NULL
        )
     `);

    console.log("Best tables build!")
    }catch (error) {
        console.error("Oops, your tables were not built...")
     throw error
    }
};

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUsers({ username: 'albert', password: 'bertie99', name: "Albert", location: "Wisconsin"});
        const sandra = await createUsers({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: "Portland" });
        const glamgal = await createUsers({ username: 'glamgal', password: 'soglam', name: 'Glammy', location: 'Vancouver' });

        console.log(albert, sandra, glamgal);

        console.log("Finished creating user!");
    }catch(error) {
        console.log("Error creating users!")
        throw error;
    }
}

async function createInitialPosts(){
    try{
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post!"
        });
        
        await createPost({
            authorId: sandra.id,
            title:"First Post",
            content:"This is also my first post!"
        });

        await createPost({
            authorId: glamgal.id,
            title: "First Post",
            content: "Don't forget about my first post!"
        });

    } catch(error){
        throw error
    }
};

async function createInitialTags() {
    try {
      console.log("Starting to create tags...");
  
      const [happy, sad, inspo, catman] = await createTags([
        '#happy', 
        '#worst-day-ever', 
        '#youcandoanything',
        '#catmandoeverything'
      ]);
  
      const [postOne, postTwo, postThree] = await getAllPosts();
  
      await addTagsToPost(postOne.id, [happy, inspo]);
      await addTagsToPost(postTwo.id, [sad, inspo]);
      await addTagsToPost(postThree.id, [happy, catman, inspo]);
  
      console.log("Finished creating tags!");
    } catch (error) {
      console.log("Error creating tags!");
      throw error;
    }
  }

async function rebuildDB() {
    try {
        client.connect();
            
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        await createInitialTags();
    } catch (error) {;
        throw error;
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUsers(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }
  
  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(()=> client.end());

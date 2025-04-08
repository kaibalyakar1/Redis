//create redis client connection

//Step 1 --> Import Redis
const redis = require("redis");

//Step 2 --> Create Redis Client

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//Step 3 --> On Error

client.on("error", (error) => {
  console.error("Redis Client Error", error);
});

//step 4 --> Connect to Redis Server

async function connectRedis() {
  try {
    // Connect to Redis server
    await client.connect();
    console.log("Connected to Redis server");

    await client.set("key", "value"); // Set a key-value pair
    const getVal = await client.get("key"); // Get the value of the key
    console.log("Value of key:", getVal);

    //delete the key
    const del = await client.del("key");
    console.log("Deleted key:", del); // Log the deleted key

    // Check if the key exists
    const updatedKey = await client.get("key");
    if (updatedKey === null) {
      console.log("Key does not exist anymore");
    } else {
      console.log("Key still exists:", updatedKey);
    }

    const value = await client.set("count", 0); // Set a key-value pair
    console.log("Value of count:", value); // Log the value of count
    const increment = await client.incr("count");
    await client.incr("count"); // Increment the value of count
    console.log("Incremented count:", increment); // Log the incremented value of count
    // Log the incremented value of count

    await client.incr("count"); // Increment the value of count
    console.log("Incremented count:", increment); // Log the incremented value of count

    await client.incr("count"); // Increment the value of count
    // Increment the value of count
    console.log("Incremented count:", increment); // Log the incremented value of count
    const decrement = await client.decr("count"); // Decrement the value of count
    console.log("Decremented count:", decrement); // Log the decremented value of count
  } catch (error) {
    console.error("Error connecting to Redis", error);
  } finally {
    // Step 5 --> Disconnect from Redis server
    await client.quit();
  }
}

connectRedis();

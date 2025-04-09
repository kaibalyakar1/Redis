const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function testPubSub() {
  try {
    await client.connect();
    const subscriber = client.duplicate(); // Create a duplicate client for subscribing

    await subscriber.connect(); // Connect the subscriber client
    console.log("✅ Subscriber connected to Redis");

    await subscriber.subscribe("news", (message, channel) => {
      console.log(`Received message from ${channel}: ${message}`);
    });

    // Publish a message to the 'news' channel
    await client.publish("news", "Hello, this is a test message!");
    console.log("✅ Message published to 'news' channel");
    await client.publish("news", "Hello, this is another test message!");
    console.log("✅ Another message published to 'news' channel");

    await new Promise((resove) => setTimeout(resove, 10000)); // Wait for 10 seconds to receive messages
    // Unsubscribe from the 'news' channel after 10 seconds
    await subscriber.unsubscribe("news");
    console.log("✅ Unsubscribed from 'news' channel");

    await subscriber.quit(); // Close the subscriber client connection
    console.log("✅ Subscriber disconnected from Redis");
  } catch (err) {
    console.error("Error in testPubSub:", err);
  } finally {
    client.quit();
  }
}
testPubSub();

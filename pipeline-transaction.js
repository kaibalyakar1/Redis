const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("error", (err) => {
  console.log("Error: ", err);
});

async function conectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis server 🚕🚕");

    // pipeline example
    const pipeline = client.multi();

    pipeline.hSet("user:5", "name", "Kaibaalya");
    pipeline.hSet("user:5", "age", 25);

    pipeline.hSet("user:8", "name", "Arpita");
    pipeline.hSet("user:8", "age", 22);

    pipeline.hSet("user:9", "name", "Dhruv");
    pipeline.hSet("user:9", "age", 20);

    pipeline.hGetAll("user:9");

    const result = await pipeline.exec();
    console.log("Pipeline result: ", result);

    console.log(
      "🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕🚕"
    );

    // ✅ transaction example (new multi instance)
    const transaction = client.multi();
    transaction.hIncrBy("user:5", "age", 1);
    transaction.hIncrBy("user:8", "age", 1);
    transaction.hIncrBy("user:9", "age", 1);

    const transactionRes = await transaction.exec();
    console.log("Transaction result: ", transactionRes);
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.quit();
  }
}

conectRedis();

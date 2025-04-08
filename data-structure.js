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

async function connectRedis() {
  try {
    await client.connect();
    console.log("✅ Connected to Redis");

    //STRING -> SET -> GET -> DEL -> EXISTS -> MSET -> MGET
    // Set multiple key-value pairs
    await client.mSet({
      "user:name": "nerd",
      "user:age": "30", // always store strings
    });

    // Get multiple keys
    const [name, age] = await client.mGet(["user:name", "user:age"]);
    console.log("👤 Name:", name);
    console.log("🎂 Age:", age);

    //LIST -> LPUSH -> LRANGE -> LPOP -> LREM -> RPOP -> LTRIM

    await client.lPush("notes", ["note1", "note2", "note3"]); // Add to the left
    await client.rPush("notes", ["note4", "note5"]); // Add to the right
    const notes = await client.lRange("notes", 0, -1); // Get all notes
    console.log("📝 Notes:", notes);
    await client.lPop("notes"); // Remove from the left
    const notesAfterPop = await client.lRange("notes", 0, -1);
    console.log("📝 Notes After Pop:", notesAfterPop);
    console.log(
      "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
    );
    //SETS -> SADD -> SMEMBERS -> SREM -> SISMEMBER -> SCARD

    await client.sAdd("skills", ["js", "python", "java"]); // Add to the set skills is a set
    const skillsCount = await client.sCard("skills"); // Count of skills
    console.log("💻 Skills Count:", skillsCount);
    const skills = await client.sMembers("skills"); // Get all skills
    console.log("💻 Skills:", skills);
    const isPresent = await client.sIsMember("skills", "js"); // Check if js is present
    console.log("💻 Is JS Present:", isPresent);
    const removeItem = await client.sRem("skills", "js"); // Remove js from skills
    console.log("💻 Remove JS:", removeItem);
    console.log(
      "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀ZSETS🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
    );
    //ZSETS -> ZADD -> ZRANGE -> ZREM -> ZCARD -> ZSCORE

    await client.zAdd("leaderboard", [
      { score: 100, value: "nerd" },
      { score: 200, value: "coder" },
    ]); // Add to the sorted set leaderboard is a sorted set
    const leaderboard = await client.zRange("leaderboard", 0, -1); // Get all leaderboard
    console.log("🏆 Leaderboard:", leaderboard);

    const score = await client.zScore("leaderboard", "nerd"); // Get score of nerd
    console.log("🏆 Score of nerd:", score);

    await client.zIncrBy("leaderboard", 50, "nerd"); // Increment score of nerd by 50
    const updatedScore = await client.zScore("leaderboard", "nerd"); // Get updated score of nerd
    console.log("🏆 Updated Score of nerd:", updatedScore);

    await client.zRem("leaderboard", "coder"); // Remove coder from leaderboard
    const leaderboardAfterRem = await client.zRange("leaderboard", 0, -1); // Get updated leaderboard
    console.log("🏆 Leaderboard After Remove:", leaderboardAfterRem);

    console.log(
      "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
    );

    //HASHES -> HSET -> HGET -> HGETALL -> HDEL -> HEXISTS
    await client.hSet("user:101", {
      name: "Kaibalya",
      age: "23",
      email: "kaibalya@example.com",
    }); // Add to the hash user:101 is a hash
    const user = await client.hGet("user:101", "name"); // Get name of user:101
    console.log("👤 Name:", user);
    console.log(await client.hGetAll("user:101")); // Get all user:101

    await client.hDel("user:101", "email");

    console.log(await client.hExists("user:101", "age")); // Check if age exists in user:101
    console.log(await client.hExists("user:101", "email"));

    await client.hIncrBy("user:101", "age", 1); // Increment age of user:101 by 1
    console.log(await client.hGet("user:101", "age")); // Get updated age of user:101
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.quit();
    console.log("🔌 Disconnected from Redis");
  }
}

connectRedis();

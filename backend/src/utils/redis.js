const redis = require("redis");

class RedisService {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = redis.createClient({
        url: process.env.REDIS_URL,
      });

      await this.connection.connect();
    }
  }

  getConnection() {
    return this.connection;
  }

  async getKeys(pattern) {
    try {
      if (this.connection) {
        const keys = await this.connection.keys(pattern);

        return keys;
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log("RedisService:getKeys", e);

      return [];
    }
  }

  async getValue(key) {
    try {
      if (this.connection) {
        const value = await this.connection.get(key);

        return JSON.parse(value);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log("RedisService:getValue", e);

      return null;
    }
  }

  async setValue(key, value, ttlSeconds = 60) {
    try {
      if (this.connection) {
        // await this.connection.set(key, JSON.stringify(value), "EX", ttlSeconds);

        await this.connection.set(key, JSON.stringify(value), {
          EX: ttlSeconds,
        });

        return true;
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error("RedisService:setValue", e);

      return false;
    }
  }

  async setValueWithoutExpiry(key, value) {
    try {
      if (this.connection) {
        await this.connection.set(key, JSON.stringify(value));

        return true;
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error("RedisService:setValueWithoutExpiry", e);

      return false;
    }
  }

  async deleteValues(key) {
    try {
      if (this.connection) {
        await this.connection.del(key);

        return true;
      }
    } catch (e) {
      console.error("RedisService:deleteValues", e);

      return false;
    }
  }

  async deleteValuesByPattern(pattern) {
    try {
      const keys = await this.connection.keys(pattern);

      await this.connection.del(keys);

      return true;
    } catch (e) {
      console.error("RedisService:deleteValues", e);
      return false;
    }
  }

  async incrValue(key, value = 1) {
    try {
      if (this.connection) {
        await this.connection.incrBy(key, value);

        return true;
      }
    } catch (e) {
      console.error("RedisService:incrValue", e);

      return false;
    }
  }

  async hashSetValue(hashKey, key, value) {
    try {
      if (this.connection) {
        await this.connection.hSet(hashKey, key, JSON.stringify(value));

        return true;
      }

      throw new Error();
    } catch (e) {
      console.error("RedisService:hashSetValue", e);

      return false;
    }
  }

  async hashGetAllValues(hashKey) {
    try {
      if (this.connection) {
        const value = await this.connection.hGetAll(hashKey);

        return Object.keys(value);
      }

      throw new Error();
    } catch (e) {
      console.log("RedisService:hashGetAllValues", e);

      return null;
    }
  }

  async hashGetValue(hashKey, key) {
    try {
      if (this.connection) {
        const value = await this.connection.hGet(hashKey, key);

        return JSON.parse(value);
      }

      throw new Error();
    } catch (e) {
      console.log("RedisService:hashGetValue", e);

      return null;
    }
  }

  async hashDeleteValue(hashKey, key) {
    try {
      if (this.connection) {
        await this.connection.hDel(hashKey, key);

        return true;
      }

      throw new Error();
    } catch (e) {
      console.error("RedisService:hashDeleteValue", e);

      return false;
    }
  }

  parseRedisSearchResults(results) {
    const total = results[0];
    const parsed = [];

    for (let i = 1; i < results.length; i += 2) {
      const doc = results[i + 1];
      const json = JSON.parse(doc[1]);
      parsed.push(json);
    }

    return parsed;
  }

}

module.exports = new RedisService();

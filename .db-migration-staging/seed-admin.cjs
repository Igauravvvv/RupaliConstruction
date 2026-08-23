"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text2) {
      return supportsAnsi() ? `\x1B[2m${text2}\x1B[0m` : text2;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// api/queries/connection.ts
var import_mysql2 = require("drizzle-orm/mysql2");

// node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// api/lib/env.ts
function required(name) {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}
var env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL || "sqlite:memory",
  kimiAuthUrl: process.env.KIMI_AUTH_URL || "https://auth.kimi.com",
  kimiOpenUrl: process.env.KIMI_OPEN_URL || "https://open.kimi.com",
  ownerUnionId: process.env.OWNER_UNION_ID ?? ""
};

// db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  chatMessages: () => chatMessages,
  contacts: () => contacts,
  localUsers: () => localUsers,
  projects: () => projects,
  testimonials: () => testimonials,
  users: () => users
});
var import_mysql_core = require("drizzle-orm/mysql-core");
var users = (0, import_mysql_core.mysqlTable)("users", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  unionId: (0, import_mysql_core.varchar)("unionId", { length: 255 }).notNull().unique(),
  name: (0, import_mysql_core.varchar)("name", { length: 255 }),
  email: (0, import_mysql_core.varchar)("email", { length: 320 }),
  avatar: (0, import_mysql_core.text)("avatar"),
  role: (0, import_mysql_core.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date()),
  lastSignInAt: (0, import_mysql_core.timestamp)("lastSignInAt").defaultNow().notNull()
});
var localUsers = (0, import_mysql_core.mysqlTable)("local_users", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  username: (0, import_mysql_core.varchar)("username", { length: 255 }).notNull().unique(),
  displayName: (0, import_mysql_core.varchar)("displayName", { length: 255 }),
  email: (0, import_mysql_core.varchar)("email", { length: 320 }),
  passwordHash: (0, import_mysql_core.varchar)("passwordHash", { length: 255 }).notNull(),
  role: (0, import_mysql_core.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date())
});
var contacts = (0, import_mysql_core.mysqlTable)("contacts", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  name: (0, import_mysql_core.varchar)("name", { length: 255 }).notNull(),
  email: (0, import_mysql_core.varchar)("email", { length: 320 }).notNull(),
  phone: (0, import_mysql_core.varchar)("phone", { length: 50 }),
  city: (0, import_mysql_core.varchar)("city", { length: 100 }),
  service: (0, import_mysql_core.varchar)("service", { length: 100 }),
  budget: (0, import_mysql_core.varchar)("budget", { length: 100 }),
  message: (0, import_mysql_core.text)("message"),
  status: (0, import_mysql_core.mysqlEnum)("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var blogPosts = (0, import_mysql_core.mysqlTable)("blog_posts", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  title: (0, import_mysql_core.varchar)("title", { length: 255 }).notNull(),
  slug: (0, import_mysql_core.varchar)("slug", { length: 255 }).notNull().unique(),
  excerpt: (0, import_mysql_core.text)("excerpt"),
  content: (0, import_mysql_core.text)("content").notNull(),
  coverImage: (0, import_mysql_core.text)("coverImage"),
  category: (0, import_mysql_core.varchar)("category", { length: 100 }),
  tags: (0, import_mysql_core.text)("tags"),
  author: (0, import_mysql_core.varchar)("author", { length: 255 }),
  published: (0, import_mysql_core.boolean)("published").default(false).notNull(),
  featured: (0, import_mysql_core.boolean)("featured").default(false).notNull(),
  viewCount: (0, import_mysql_core.int)("viewCount").default(0).notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().notNull().$onUpdate(() => /* @__PURE__ */ new Date())
});
var projects = (0, import_mysql_core.mysqlTable)("projects", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  name: (0, import_mysql_core.varchar)("name", { length: 255 }).notNull(),
  slug: (0, import_mysql_core.varchar)("slug", { length: 255 }).notNull().unique(),
  description: (0, import_mysql_core.text)("description"),
  location: (0, import_mysql_core.varchar)("location", { length: 255 }),
  area: (0, import_mysql_core.varchar)("area", { length: 100 }),
  duration: (0, import_mysql_core.varchar)("duration", { length: 100 }),
  type: (0, import_mysql_core.mysqlEnum)("type", ["residential", "commercial", "renovation", "interior"]).default("residential").notNull(),
  status: (0, import_mysql_core.mysqlEnum)("status", ["ongoing", "completed"]).default("completed").notNull(),
  images: (0, import_mysql_core.text)("images"),
  featured: (0, import_mysql_core.boolean)("featured").default(false).notNull(),
  completionDate: (0, import_mysql_core.varchar)("completionDate", { length: 50 }),
  cost: (0, import_mysql_core.varchar)("cost", { length: 100 }),
  processSteps: (0, import_mysql_core.text)("process_steps"),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var testimonials = (0, import_mysql_core.mysqlTable)("testimonials", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  name: (0, import_mysql_core.varchar)("name", { length: 255 }).notNull(),
  location: (0, import_mysql_core.varchar)("location", { length: 255 }),
  project: (0, import_mysql_core.varchar)("project", { length: 255 }),
  rating: (0, import_mysql_core.int)("rating").default(5).notNull(),
  content: (0, import_mysql_core.text)("content").notNull(),
  image: (0, import_mysql_core.text)("image"),
  featured: (0, import_mysql_core.boolean)("featured").default(false).notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var chatMessages = (0, import_mysql_core.mysqlTable)("chat_messages", {
  id: (0, import_mysql_core.serial)("id").primaryKey(),
  sessionId: (0, import_mysql_core.varchar)("sessionId", { length: 255 }).notNull(),
  role: (0, import_mysql_core.mysqlEnum)("role", ["user", "assistant"]).notNull(),
  content: (0, import_mysql_core.text)("content").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});

// db/relations.ts
var relations_exports = {};

// api/queries/connection.ts
var fullSchema = { ...schema_exports, ...relations_exports };
var instance;
function getDb() {
  if (!instance) {
    instance = (0, import_mysql2.drizzle)(env.databaseUrl, {
      mode: "planetscale",
      schema: fullSchema
    });
  }
  return instance;
}

// seed-admin.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
async function seedAdmin() {
  const db = getDb();
  console.log("Seeding admin...");
  const passwordHash = await import_bcryptjs.default.hash("admin123", 12);
  await db.insert(localUsers).values({
    username: "admin",
    passwordHash,
    displayName: "Administrator",
    role: "admin"
  });
  console.log("Admin user created: username 'admin', password 'admin123'");
  process.exit(0);
}
seedAdmin().catch(console.error);

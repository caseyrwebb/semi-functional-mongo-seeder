const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    MONGODB_NAME: Joi.string()
      .required()
      .description("Mongo User database name"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  client: envVars.CLIENT_URL,
  mongo: {
    db: envVars.MONGODB_NAME,
    archiveDb: envVars.MONGODB_ARCHIVE_NAME,
    schemaDb: envVars.MONGODB_SCHEMA_NAME,
    testDb: envVars.MONGODB_TEST_NAME,
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //     useCreateIndex: true,
      //     useFindAndModify: false,
      //     // useFindAndModify:  true,
      //     // Dev
      //     autoIndex: true,
      //     poolSize: 5, // Default 5 - MAX 10?
      //     socketTimeoutMS: 45000, // 30000 by Default (30 seconds), you should set this to 2-3x your longest running operation
      //     family: 4, // Use IP4 instead of trying IP6 first
      //     serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 5 sec - 30000 by Default (30 seconds) -
      //     heartbeatFrequencyMS: 30000, // A heartbeat is subject to serverSelectionTimeoutMS
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    userExpirationDays: envVars.JWT_USER_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};

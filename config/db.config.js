require("dotenv").config();

const config = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Adicionar estas opções para debug
  logging: console.log,
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true
  },
  timezone: '+00:00' // Importante para datas
};

module.exports = config;
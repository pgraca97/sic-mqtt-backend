const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection do DB has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

const db = {};
//export the sequelize object (DB connection)
db.sequelize = sequelize;
//export User model
db.user = require("./user.model.js")(sequelize, DataTypes);
//export House model
db.house = require("./house.model.js")(sequelize, DataTypes);
//export UserHouse model
db.userHouse = require("./userHouse.model.js")(sequelize, DataTypes);

// 1:N, 1 user, N houses
db.user.hasMany(db.house, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
db.house.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "owner",
});

// N:M, N users, M houses
db.user.belongsToMany(db.house, {
  through: db.userHouse,
  foreignKey: "user_id",
  otherKey: "house_id",
});
db.house.belongsToMany(db.user, {
  through: db.userHouse,
  foreignKey: "house_id",
  otherKey: "user_id",
});

// // optionally: SYNC
/* (async () => {
  try {
    //await sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
    await sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
    //await sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
    console.log("DB is successfully synchronized");
  } catch (error) {
    console.log(error);
  }
})(); */

module.exports = db;

const dbConfigProd = require("../config/db.config.js");
const dbConfigTest = require("../config/db.configTest.js");

const Sequelize = require("sequelize");

const dbConfig = dbConfigProd; // be sure to change this if you are running the unit tests.

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.institutions = require("./institution.model.js")(sequelize, Sequelize);
db.pendingInstitutions = require("./pendingInstitution.model.js")(sequelize, Sequelize);
db.records = require("./record.model.js")(sequelize, Sequelize);
db.pendingRecords = require("./pendingRecord.model.js")(sequelize, Sequelize);

// DB Relationships

//=============================================
db.users.hasMany(db.pendingRecords, {
    as: 'PendingRecords',
    foreignKey: 'UserID',
    onDelete: 'CASCADE'
});
db.pendingRecords.belongsTo(db.users, {
    as: 'Student',
    foreignKey: 'UserID'
});

db.institutions.hasMany(db.pendingRecords, {
    foreignKey: 'InstitutionID',
    onDelete: 'CASCADE'
});
db.pendingRecords.belongsTo(db.institutions, {
    foreignKey: 'InstitutionID'
});

//join to get institution name, not tested
db.institutions.hasMany(db.records, {
    as: 'Records',
    foreignKey: 'InstitutionID',
    onDelete: 'CASCADE'
})
db.records.belongsTo(db.institutions, {
    as: 'Institution',
    foreignKey: 'InstitutionID'
});
//=============================================
db.users.hasMany(db.records, {
    as: 'Records',
    foreignKey: 'UserID',
    onDelete: 'CASCADE'
});
db.records.belongsTo(db.users, {
    as: 'Student',
    foreignKey: 'UserID'
});

db.institutions.hasMany(db.records, {
    foreignKey: 'InstitutionID',
    onDelete: 'CASCADE'
});
db.records.belongsTo(db.institutions, {
    foreignKey: 'InstitutionID'
});

db.users.hasOne(db.institutions, {
    foreignKey: 'UserID',
    onDelete: 'CASCADE'
});
db.institutions.belongsTo(db.users, {
    foreignKey: 'UserID'
});

module.exports = db;


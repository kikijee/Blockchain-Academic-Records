module.exports = (sequelize, Sequelize) => {
    const PendingInstitution = sequelize.define("Pending_Institutions", {
        PendingInstitutionID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        SchoolName: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false
        },
        Address: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        Email: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false
        },
        WalletAddress:{
            type: Sequelize.STRING(42),
            unique: true,
            allowNull: false
        },
        FirstName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        LastName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        DateOfBirth: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        AuthenticationData: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        Created_At: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        },
    },{timestamps: false});
    return PendingInstitution;
};


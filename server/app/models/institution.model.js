module.exports = (sequelize, Sequelize) => {
    const Institution = sequelize.define("Institutions", {
        InstitutionID: {
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
        WalletAddress:{
            type: Sequelize.STRING(42),
            unique: true,
            allowNull: false
        },
        UserID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'UserID'
            }
        },
        Created_At: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        }
    },{timestamps: false});
    return Institution;
};

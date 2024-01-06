module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("Users", {
        UserID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Email: {
            type: Sequelize.STRING(255),
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
        Role: {
            type: Sequelize.STRING(12),
            allowNull: false,
            validate: {
                isIn: [['Admin', 'Student', 'Institution']]
            }
        },
        Created_At: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        }
    },{timestamps: false});
    return User;
};

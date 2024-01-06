module.exports = (sequelize, Sequelize) => {
    const Record = sequelize.define("Records", {
        RecordID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'UserID'
            }
        },
        InstitutionID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Institutions',
                key: 'InstitutionID'
            }
        },
        RecordType: {
            type: Sequelize.STRING(13),
            allowNull: false,
            validate: {
                isIn: [['Transcript', 'Certification', 'Degree']]
            }
        },
        IPFS_Hash: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        TransactionAddress:{
            type: Sequelize.STRING(66),
            unique: true,
            //allowNull: false
        },
        Created_At: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        }
    },{timestamps: false});
    return Record;
};

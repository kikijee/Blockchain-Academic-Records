module.exports = (sequelize, Sequelize) => {
    const PendingRecord = sequelize.define("Pending_Records", {
        PendingRecordID: {
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
        Description:{
            type: Sequelize.STRING(500), 
            allowNull: false,
        },
        Note:{
            type: Sequelize.STRING(500),
            allowNull: true
        },
        RecordType: {
            type: Sequelize.STRING(13),
            allowNull: false,
            validate: {
                isIn: [['Transcript', 'Certification', 'Degree']]
            }
        },
        Status: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['Pending School', 'Pending Student']]
            }
        },
        Created_At: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
        },
        IPFS_Hash: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },{timestamps: false});
    return PendingRecord;
};

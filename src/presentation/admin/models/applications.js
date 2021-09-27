// This model was generated by Forest CLI. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const {Sequelize} = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Applications = sequelize.define(
    'applications',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataPassId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      userEmails: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      scopes: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      subscriptions: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      tokens: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
    },
    {
      tableName: 'applications',
      underscored: true,
      timestamps: false,
      schema: process.env.DATABASE_SCHEMA,
    }
  );

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Applications.associate = models => {};

  return Applications;
};

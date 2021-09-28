// This model was generated by Forest CLI. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const {Sequelize} = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Tokens = sequelize.define(
    'tokens',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      applicationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
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
    },
    {
      tableName: 'tokens',
      underscored: true,
      timestamps: false,
      schema: process.env.DATABASE_SCHEMA,
    }
  );

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Tokens.associate = models => {
    Tokens.belongsTo(models.applications, {
      foreignKey: 'applicationId',
      onDelete: 'CASCADE',
    });
  };

  return Tokens;
};
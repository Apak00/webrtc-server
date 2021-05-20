import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  define: {
    timestamps: false,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection has been established successfully.");
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync({
  logging: console.log,
});

export default sequelize;

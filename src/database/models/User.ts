import { DataTypes } from "sequelize";
import { Model } from "sequelize";
import connection from "../connection";
import { afterValidate } from "../hooks/user";

export class User extends Model {
  public readonly id!: number;
  public readonly userId!: string;
  public password!: string;
}

User.init(
  {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    hooks: {
      afterValidate,
    },
    sequelize: connection,
    modelName: "user",
  }
);

// TODO: Relation between courses

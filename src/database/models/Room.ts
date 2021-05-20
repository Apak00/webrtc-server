import { DataTypes } from "sequelize";
import { Model } from "sequelize";
import connection from "../connection";

export class Room extends Model {
  public readonly id!: string;
  public detail!: string;
  public maxParticipants!: number | null;
}

Room.init(
  {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      defaultValue: "Coming soon...",
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: connection,
    modelName: "room",
  }
);

Room.sync({ force: true });
// TODO: Relation between users

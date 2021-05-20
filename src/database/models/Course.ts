import { DataTypes } from "sequelize";
import { Model } from "sequelize";
import connection from "../connection";
import { isNotOnlyNumbers } from "../validations/course";

enum COURSE_APPROVAL_STATUSES {
  NOT_APPROVED,
  APPROVED,
  WAITING_FOR_APPROVAL,
  REJECTED,
}

export class Course extends Model {
  public readonly id!: number;
  public readonly name!: string;
  public detail!: string;
  public approvalStatus: COURSE_APPROVAL_STATUSES;
  public numberOfMaxAttendies!: number;
}

Course.init(
  {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      unique: true,
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "Length should be between 2 and 50 characters",
        },
        isAlphanumeric: true,
        isNotOnlyNumbers,
      },
    },
    detail: {
      type: DataTypes.TEXT,
      defaultValue: "Coming soon...",
    },
    numberOfMaxAttendies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approvalStatus: {
      type: DataTypes.INTEGER,
      defaultValue: COURSE_APPROVAL_STATUSES.NOT_APPROVED,
    },
  },
  {
    sequelize: connection,
    modelName: "course",
  }
);

// TODO: Relation between users

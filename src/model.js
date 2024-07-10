import { Model, DataTypes } from "sequelize"
import util from "util"
import connectToDB from "./db.js"
import url from 'url'

export const db = await connectToDB("postgresql:///ratings")

export class User extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

User.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: "user",
        sequelize: db
    }
)

class Movie extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}
Movie.init(
    {
        movieId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        overview: DataTypes.TEXT,
        releaseDate: DataTypes.DATE,
        posterPath: DataTypes.STRING
    },
    {
        modelName: "movie",
        sequelize: db
    }
)

class Rating extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Rating.init({
    ratingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
  modelName: 'rating', 
  sequelize: db,
  timestamps: true,
  updatedAt: false
})

Movie.hasMany(Rating, {foreignKey: 'movieId'})
Rating.belongsTo(Movie, {foreignKey: 'movieId'})

User.hasMany(Rating, {foreignKey: 'userId'})
Rating.belongsTo(User, {foreignKey: 'userId'})

if(process.argv[1] === url.fileURLToPath(import.meta.url)) {
  console.log('Syncing database...');
  await db.sync({force: true});
  console.log('Finished syncing database!');
}

export {Movie, Rating}
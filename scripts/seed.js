import { Movie, Rating, User, db } from "../src/model.js"
import movieData from "./data/movies.json" assert { type: "json" }
import lodash from 'lodash';

console.log('seed.js: Syncing Database...')
await db.sync({force: true})

const moviesInDB = await Promise.all(
    movieData.map((movie) => {
        const releaseDate = new Date(Date.parse(movie.releaseDate))
        
        const newMovie = Movie.create({
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.posterPath,
            releaseDate
        })
    
        return newMovie
    })
)

const usersToCreate = []
for(let i = 0; i < 10; i++){
    const email = `user${i}@test.com`
    usersToCreate.push(User.create({
        email: email,
        password: 'test'
    }))
}

const usersInDB = await Promise.all(usersToCreate)


const ratingsInDB = await Promise.all(
    usersInDB.flatMap(user => {
        const randomMovies = lodash.sampleSize(moviesInDB, 10)

        const movieRatings = randomMovies.map(movie => {
            return Rating.create({
                score: lodash.random(1,5),
                userId: user.userId,
                movieId: movie.movieId
            })
        })

        return movieRatings
    })
)

console.log(ratingsInDB)
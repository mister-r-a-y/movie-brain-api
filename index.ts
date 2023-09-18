import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
const app = express()
const jsonMiddleware = bodyParser.json()
app.use(jsonMiddleware)
const port = 4000
const listenMessage = `listening on ${port}`
function onListen() {
  console.info(listenMessage)
}
app.listen(port, onListen)
function getRoot(request: Request, response: Response) {
  response.send('welcome home')
}
app.get('/', getRoot)

const movies = [
  {name: 'The Godfather', year: 1972, runtime: 175, target: 1},
  {name: 'Goodfellas', year: 1990, runtime: 146, target: 0}
]

const totalYear = movies.reduce((totalYear, movie) => totalYear + movie.year, 0)
const averageYear = totalYear / movies.length

const totalRuntime = movies.reduce((totalRuntime, movie) => totalRuntime + movie.runtime, 0)
const averageRuntime = totalRuntime / movies.length
console.log('averageYear', averageYear)
console.log('averageRuntime', averageRuntime)
function getMovies(request: Request, response: Response) {
  response.send(movies)
}

app.get('/movies', getMovies)

function getHello(request: Request, response: Response) {
  const message = `hello ${request.params.abc}`
  response.send(message)
}

app.get('/hello/:abc', getHello)

function getMovie(request: Request, response: Response) {
  const movie = movies.find(movie => movie.name === request.params.name)
  response.send(movie)
}

app.get('/movie/:name', getMovie)

function postMovie(request: Request, response: Response) {
  const newMovie = {
    name: request.body.name, 
    year: request.body.year, 
    runtime: request.body.runtime, 
    target: request.body.target
  }
  movies.push(newMovie)
  response.send('movie added')
}

app.post('/movie', postMovie)
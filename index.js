"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const jsonMiddleware = body_parser_1.default.json();
app.use(jsonMiddleware);
const port = 4000;
const listenMessage = `listening on ${port}`;
function onListen() {
    console.info(listenMessage);
}
app.listen(port, onListen);
function getRoot(request, response) {
    response.send('welcome home');
}
app.get('/', getRoot);
const trainingMovies = [
    { name: 'The Godfather', year: 1972, runtime: 175, target: 1 },
    { name: 'Goodfellas', year: 1990, runtime: 146, target: 1 },
    { name: 'The Usual Suspects', year: 1995, runtime: 106, target: 1 },
    { name: 'Lady Bird', year: 2017, runtime: 94, target: 1 },
    { name: 'Mad Max: Fury Road', year: 2015, runtime: 120, target: 1 },
    { name: 'Barbie', year: 2023, runtime: 114, target: 0 },
    { name: 'Forrest Gump', year: 1994, runtime: 142, target: 0 },
    { name: 'Back to the Future', year: 1984, runtime: 116, target: 0 },
    { name: 'Titanic', year: 1997, runtime: 194, target: 0 },
    { name: 'The Green mile', year: 1999, runtime: 189, target: 0 }
];
const totalYear = trainingMovies.reduce((totalYear, movie) => totalYear + movie.year, 0);
const averageYear = totalYear / trainingMovies.length;
const totalRuntime = trainingMovies.reduce((totalRuntime, movie) => totalRuntime + movie.runtime, 0);
const averageRuntime = totalRuntime / trainingMovies.length;
const network = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
function sigma(n) {
    return 1 / (1 + Math.exp(-n));
}
function perceptron(axons, inputA, inputB) {
    const [weightA, weightB, bias] = axons;
    const feelingA = inputA * weightA;
    const feelingB = inputB * weightB;
    const opinion = feelingA + feelingB + bias;
    const prediction = sigma(opinion);
    return prediction;
}
function predict(network, year, runtime) {
    const normalYear = year - averageYear;
    const normalRuntime = runtime - averageRuntime;
    const neuron1 = perceptron(network[0], normalYear, normalRuntime);
    const neuron2 = perceptron(network[1], normalYear, normalRuntime);
    const neuron3 = perceptron(network[2], neuron1, neuron2);
    return neuron3;
}
function getError(prediction, target) {
    return Math.abs(prediction - target);
}
function getLoss(movies, network) {
    movies.forEach(movie => {
        movie.prediction = predict(network, movie.year, movie.runtime);
        movie.error = getError(movie.prediction, movie.target);
    });
    const totalError = movies.reduce((totalError, movie) => { var _a; return totalError + ((_a = movie.error) !== null && _a !== void 0 ? _a : 0); }, 0);
    const averageError = totalError / movies.length;
    return averageError;
}
function mutate(n) {
    const chaos = Math.random() - 0.5;
    return n + chaos;
}
function evolve(network) {
    return network.map(axons => axons.map(mutate));
}
function train() {
    let steps = 1;
    while (steps < 1000) {
        const offspring = evolve(network);
        const originalLoss = getLoss(trainingMovies, network);
        const offspringLoss = getLoss(trainingMovies, offspring);
        const difference = originalLoss - offspringLoss;
        const improved = difference > 0.0001;
        if (improved) {
            console.info(`Loss: ${offspringLoss.toFixed(20)} (${steps}) [${difference.toFixed(20)}]`);
            offspring.forEach((axons, index) => {
                network[index] = axons;
            });
            steps = 1;
        }
        else {
            steps += 1;
        }
    }
}
train();
console.log('new network', network);
function getMovies(request, response) {
    response.send(trainingMovies);
}
app.get('/movies', getMovies);
function getHello(request, response) {
    const message = `hello ${request.params.abc}`;
    response.send(message);
}
app.get('/hello/:abc', getHello);
function getMovie(request, response) {
    const movie = trainingMovies.find(movie => movie.name === request.params.name);
    response.send(movie);
}
app.get('/movie/:name', getMovie);
function postTrainingMovie(request, response) {
    const newMovie = {
        name: request.body.name,
        year: request.body.year,
        runtime: request.body.runtime,
        target: request.body.target
    };
    trainingMovies.push(newMovie);
    response.send('movie added');
}
app.post('/training-movie', postTrainingMovie);
function postTestingMovie(request, response) {
    const prediction = predict(network, request.body.year, request.body.runtime);
    response.send({ prediction });
}
app.post('/testing-movie', postTestingMovie);

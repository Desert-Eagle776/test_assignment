import express from 'express';
import tinify from 'tinify';
import expressHandlebars, { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import errorMiddleware from './src/middlewares/error-middleware.js';
import UsersModel from './src/models/users.model.js';
import usersService from './src/services/users.service.js';

import UsersRouter from './src/routes/users.router.js';
import TokenRouter from './src/routes/token.router.js';
import PositionsRouter from './src/routes/positions.router.js';

const PORT = process.env.PORT || 3000;

const app = express();

// api key to api tinypng
tinify.key = process.env.TINIFY_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

// Setting up the template creator the handlebars
app.engine('.hbs', hbs.engine);
app.set('views', path.join(__dirname, '/src/views/'));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.static('public'));

app.use('/users', UsersRouter);
app.use('/positions', PositionsRouter);
app.use('/token', TokenRouter);

// 404 error handling
app.use(function (req, res) {
  return res.status(404).json({
    success: false,
    message: "Page not found."
  });
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`The server started on port ${PORT}...`)

  // Checking if the user table is not empty
  const usersExist = await UsersModel.count();

  // If there are no users, we generate them
  if (!usersExist) {
    await usersService.seedDatabase();
  }
});
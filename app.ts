import { NextFunction, Request, Response } from "express";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
import { MongoMemoryServer } from 'mongodb-memory-server'
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Connect to MongoDB
const connectDB = async () => {
  let dbUrl = process.env.RESTAURANT_DATABASE_URL
  if (process.env.ENVIRONMENT === 'test') {
    dbUrl = (await MongoMemoryServer.create()).getUri()
  }

  mongoose.connect(dbUrl).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err: Error) => {
    console.log("Error connecting to MongoDB", err);
  }
  );
}
connectDB();

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
interface Error {
  status?: number;
  message: string;
}

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;

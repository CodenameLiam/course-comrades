import express from 'express';
import server from './server';
import request from 'supertest';

const app = express();
app.use("/states", server)
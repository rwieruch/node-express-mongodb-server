import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import models, { connectDb } from './models';

const app = express();

// Application-Level Middleware

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use(async (req, res, next) => {
  req.me = await models.User.findByLogin('rwieruch');
  next();
});

// Routes

app.get('/me', async (req, res) => {
  const user = await req.models.User.findById(req.me.id);
  return res.send(user);
});

app.get('/users', async (req, res) => {
  const users = await req.models.User.find();
  return res.send(users);
});

app.get('/users/:userId', async (req, res) => {
  const user = await req.models.User.findById(req.params.userId);
  return res.send(user);
});

app.get('/messages', async (req, res) => {
  const messages = await req.models.Message.find();
  return res.send(messages);
});

app.get('/messages/:messageId', async (req, res) => {
  const message = await req.models.Message.findById(
    req.params.messageId,
  );
  return res.send(message);
});

app.post('/messages', async (req, res) => {
  const message = await req.models.Message.create({
    text: req.body.text,
    userId: req.me.id,
  });

  return res.send(message);
});

app.delete('/messages/:messageId', async (req, res) => {
  const result = await req.models.Message.findOneAndDelete(
    req.params.messageId,
  );

  return res.send(result);
});

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);

    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const createUsersWithMessages = () => {
  const user1 = new models.User({
    username: 'rwieruch',
  });

  const user2 = new models.User({
    username: 'ddavids',
  });

  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    userId: user1.id,
  });

  const message2 = new models.Message({
    text: 'Happy to release ...',
    userId: user2.id,
  });

  const message3 = new models.Message({
    text: 'Published a complete ...',
    userId: user2.id,
  });

  message1.save();
  message2.save();
  message3.save();

  user1.save();
  user2.save();
};

import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import models, { connectDb } from './models';

const app = express();

app.use(cors());

// Postman: x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Postman: raw + JSON (application/json)
app.use(bodyParser.json());

// Application-Level Middleware

app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use(async (req, res, next) => {
  req.me = await models.User.findByLogin('rwieruch');
  next();
});

// Routes

app.get('/me', async ({ models, me }, res) => {
  const user = await models.User.findById(me.id);
  return res.send(me);
});

app.get('/users', async ({ models }, res) => {
  const users = await models.User.find();
  return res.send(users);
});

app.get('/users/:userId', async ({ models }, res) => {
  const user = await models.User.findById(params.userId);
  return res.send(user);
});

app.get('/messages', async ({ models }, res) => {
  const messages = await models.Message.find();
  return res.send(messages);
});

app.get('/messages/:messageId', async ({ params, models }, res) => {
  const message = await models.Message.findById(params.messageId);
  return res.send(message);
});

app.post('/messages', async ({ body: { text }, models, me }, res) => {
  const message = await models.Message.create({
    text,
    userId: me.id,
  });

  return res.send(message);
});

app.delete(
  '/messages/:messageId',
  async ({ params, models }, res) => {
    const result = await models.Message.findOneAndDelete(
      params.messageId,
    );

    return res.send(true);
  },
);

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

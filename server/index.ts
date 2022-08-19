import express from 'express';
import { findOrCreateRoom, getAccessToken } from 'utils';

const app = express();
const port = 4000;
app.use(express.json());

app.post('/join-room', async (req, res) => {
  // return 400 if the request has an empty body or no roomName
  if (!req.body || !req.body.roomName) {
    return res.status(400).send('Must include roomName argument.');
  }
  const roomName = req.body.roomName;
  // find or create a room with the given roomName
  await findOrCreateRoom(roomName);

  // generate an Access Token for a participant in this room
  const token = await getAccessToken(roomName);
  res.send({
    token: token
  });
});

app.get('/', (req, res) => {
  return res.send({ message: 'This is test' });
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

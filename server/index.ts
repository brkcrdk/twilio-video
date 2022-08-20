import express from 'express';
import { findOrCreateRoom, getAccessToken } from 'utils';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post('/join-room', async (req, res) => {
  // Eğer istek sırasında oda ismi gelmezse 400 hatası veriyoruz (Oda bulunamadı!)
  if (!req.body || !req.body.roomName) {
    return res.status(400).send('Must include roomName argument.');
  }
  const roomName = req.body.roomName;
  // Eğer istekte oda ismi varsa bu isimle oda oluşturuyoruz veya o odaya giriş yapıyoruz.
  await findOrCreateRoom(roomName);

  // Bu odaya giriş için izin alıyoruz (token varsa giriş için izin verilmiştir.)
  const token = await getAccessToken(roomName);
  // Odaya girişe izin verilen tokenı client tarafına gönderiyoruz ve bu sürecin devamını
  // client yönetiyor.
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

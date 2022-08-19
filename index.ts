import dotenv from 'dotenv';
import express from 'express';

const app = express();
const port = 5001;

app.use(express.json());

dotenv.config();

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

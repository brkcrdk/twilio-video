import dotenv from 'dotenv';

dotenv.config();
const test = async () => {
  console.log(process.env.TWILIO_API_KEY_SECRET);
};

test();

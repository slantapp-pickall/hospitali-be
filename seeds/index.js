require('dotenv').config();
const { connectDB } = require('../database');
connectDB();
const { ModelUser } = require('../models');
// Creating Admin Seed
const admin = async () => {
  console.log('ran');
  const admin = await ModelUser.findOne({
    email: process.env.ADMIN
  });

  if (!admin) {
    try {
      const newAdmin = await ModelUser.create({
        email: process.env.ADMIN,
        password: 'p',
        name: 'Admin',
        isAdmin: true,
        image:
          'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Boo&mouth=default,grimace,serious,smile,twinkle,vomit',
        token: 'ertyudsshjiuytrewqdfhb'
      });
    } catch (error) {
      throw console.error('error #%d', error);
    }
    return;
  }
  return;
};

admin();

const bcrypt = require('bcrypt');
const { sequelize } = require('./db/database');
const User = require('./models/user');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected...');

    const existingAdmin = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. Aborting seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

createAdminUser();

// const bcrypt = require('bcryptjs');
// const mongoose = require('mongoose');
// const User = require('./models/user'); // Adjust the path to your User model
// const dotenv = require('dotenv');

// // Load environment variables from .env file
// dotenv.config({ path: './config.env' });

// // Database connection
// const DB = process.env.MONGODB_URI || process.env.DATABASE;
// mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("DB connection successful!"))
//   .catch(err => console.error("DB connection error:", err));

// async function updatePassword() {
//     const email =  // Replace with the user's email
//     const plainPassword = '123'; // Replace with the user's plain password

//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     await User.updateOne({ email }, { password: hashedPassword });

//     console.log('Password updated successfully');
// }

// updatePassword()
//     .then(() => mongoose.disconnect())
//     .catch(console.error);
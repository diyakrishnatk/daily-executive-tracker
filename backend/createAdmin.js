const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@test.com";
    const password = "Admin@12345";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = "Admin";
      existingAdmin.role = "admin";
      existingAdmin.password = await bcrypt.hash(password, 10);

      await existingAdmin.save();

      console.log("Admin account updated successfully!");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully!");
    }

    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

createAdmin();
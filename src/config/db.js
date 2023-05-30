const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.set("strictQuery", true);
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
};
module.exports = connectDB;
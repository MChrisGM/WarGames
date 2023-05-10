require('dotenv').config();

const Mongoose = require("mongoose")
const localDB = `mongodb+srv://`+process.env.MONGOUSR+`:`+process.env.MONGOPASS+`@cluster0.gblfvmr.mongodb.net/WarGames`
const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB
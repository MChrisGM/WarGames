const GameSchema = new Mongoose.Schema({
    available: {
      type: Boolean,
      unique: false,
      required: true,
    },
    players: {
        type: Array,
        unique: false,
        required: true,
    }
  });
  
  const Game = Mongoose.model("games", GameSchema);
  module.exports = Game;
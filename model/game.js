const GameSchema = new Mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true,
    },
    max_players: {
        type: Number,
        unique: false,
        required: true,
      },
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
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  playTime: {
    type: Number, // in seconds
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// İndeks oluştur
scoreSchema.index({ game: 1, score: -1 }); // Yüksek skorlar için
scoreSchema.index({ user: 1, game: 1 }); // Kullanıcı skorları için

export default mongoose.model('Score', scoreSchema);

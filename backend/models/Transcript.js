import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const transcriptSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
    },
    chunks: [chunkSchema],
  },
  {
    timestamps: true,
  }
);

const Transcript = mongoose.model('Transcript', transcriptSchema);

export default Transcript;

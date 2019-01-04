import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    text: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { collection: 'Message' },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
});

userSchema.statics.findByLogin = async (login) => {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;

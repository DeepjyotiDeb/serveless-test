import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  type: String,
});
const BlogSchema = new mongoose.Schema({
  title: String,
  summary: String,
  description: String,
});

export const UserTable = mongoose.model('users', UserSchema);
export const BlogTable = mongoose.model('blogs', BlogSchema);

// const schema = new mongoose.Schema({ name: 'string', size: 'string' });
// const Tank = mongoose.model('Tank', schema);

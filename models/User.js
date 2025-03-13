import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  _id : String,
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
});
export default mongoose.model('User', UserSchema);
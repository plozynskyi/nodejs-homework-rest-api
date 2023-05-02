const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const subscriptionList = ['starter', 'pro', 'business'];

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },

    password: {
      type: String,
      required: [true, 'Set password for user'],
    },

    subscription: {
      type: String,
      enum: subscriptionList,
      default: 'starter',
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

usersSchema.pre('save', async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model('user', usersSchema);

module.exports = { User };

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,       // always store lowercase
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    hash: String,
    salt: String
  },
  { timestamps: true }        // createdAt/updatedAt for auditing
);

// Ensure unique index on normalized email
userSchema.index({ email: 1 }, { unique: true });

// Safety: normalize email before save (in addition to `lowercase: true`)
userSchema.pre('save', function(next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  next();
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  // Use standard expiresIn instead of manual exp timestamp
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role || 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

mongoose.model('users', userSchema);
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import multer from 'multer';
import cloudinaryFramework from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'MONGO_URL';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true); //added due to deprecation error 26868

// -- cloudinary setup to store images -- //
const cloudinary = cloudinaryFramework.v2;
cloudinary.config({
  cloud_name: 'minechies',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profileImages',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 200, height: 200, crop: 'limit' }],
  },
});
const parser = multer({ storage });

// a schema to sign up/sign in to the user page
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex'),
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
    required: false,
  },
});

// a schema to add the rating to the database
const RatingSchema = new mongoose.Schema({
  ratingText: {
    type: String,
    required: true,
    trim: true,
    max: 50,
  },
  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  selectRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
    required: true,
  },
  selectCategory: {
    type: String,
    enum: ['Pizza', 'Pasta', 'Hamburger', 'Sushi', 'Other'],
    default: 'Pizza',
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    timestamps: true,
  },
  radioInput: {
    type: String,
    possibleValues: ['Yes', 'No'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// schema to add image //
const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
});

// --- models --- //
const User = mongoose.model('User', UserSchema);
const Rating = mongoose.model('Rating', RatingSchema);
const Image = mongoose.model('Image', ImageSchema);

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing

app.use(cors());
app.use(express.json());

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    // the seed isn't necessary when creating a new database. seed it once and then only run npm run dev
    await Rating.deleteMany({});
    await User.deleteMany({});
  };
  seedDatabase();
}

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      next(); // built in function for express that makes the app move along if there's for example an user
    } else {
      res.status(401).json({ response: 'Please log in', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// --- POST to feed --- //
app.post('/feed', authenticateUser);
app.post('/feed', async (req, res) => {
  const {
    ratingText,
    restaurantName,
    selectRating,
    selectCategory,
    radioInput,
    user,
    createdAt,
  } = req.body;

  try {
    const newRatingText = await new Rating({
      ratingText,
      restaurantName,
      selectRating,
      selectCategory,
      radioInput,
      user,
      createdAt,
    }).save();
    res.status(201).json({
      response: newRatingText,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// --- GET ratings to feed --- //
app.get('/feed', authenticateUser);
app.get('/feed', async (req, res) => {
  const main = await Rating.find({}).sort({ createdAt: -1 }).populate('user');

  res
    .status(201)
    .json({ response: main, success: true, message: 'the rating feed' });
});

// --- get USER profile info --- //
app.get('/feed/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await User.findById(userId).populate('image');
    if (profile) {
      res.status(200).json({
        response: profile,
        success: true,
      });
    } else {
      res.status(404).json({ response: 'User not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// -- PATCH user info -- //
app.patch('/feed/:userId', authenticateUser);
app.patch('/userpage/:userId', async (req, res) => {
  const updatedUserInfo = req.body;
  const { userId } = req.params;

  try {
    const updatedUserProfile = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedUserInfo },

      { new: true }
    );
    if (updatedUserProfile) {
      res.status(200).json({ response: updatedUserProfile, success: true });
    } else {
      res.status(404).json({
        message: 'User not found',
        response: 'User not found',
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: 'Could not edit user, invalid request',
      response: err,
      success: false,
    });
  }
});

// -- GETTING the users personal ratings -- //
app.get('/userpage/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userRatings = await Rating.find({ user: userId });
    if (userRatings) {
      res.status(200).json({
        response: userRatings,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.delete('/feed/:ratingId', async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findOneAndDelete({ _id: ratingId });
    if (deletedRating) {
      res.status(200).json(deletedRating);
    } else {
      res.status(404).json({ message: `rating by id ${ratingId} not found` });
    }
  } catch (err) {
    res.status(400).json({ message: 'could not delete', error: err });
  }
});

// --- delete on user page --- //
app.delete('/feed/:userId', authenticateUser);
app.delete('/userpage/:userRatingId', async (req, res) => {
  const { userRatingId } = req.params;

  const deletedUserRating = await Profile.findOneAndDelete({
    ratingId: userRatingId,
  });
  try {
    if (deletedUserRating) {
      res.status(200).json({
        response: deletedUserRating,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// --- signup --- //
app.post('/signup', async (req, res) => {
  const { username, password, email, firstName, lastName, role } = req.body;

  try {
    const salt = bcrypt.genSaltSync(); // this creates a randomizer to randomize the password string

    if (password.length < 5) {
      throw 'Password must be at least 5 characters'; // this throws the user the message and redirect user to the catch block
    }

    const newUser = await new User({
      username,
      email,
      firstName,
      lastName,
      password: bcrypt.hashSync(password, salt), // the "salt" passes the randomizer to the password
      role,
    }).save();

    res.status(201).json({
      response: {
        userId: newUser._id,
        username: newUser.username,
        accessToken: newUser.accessToken,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      success: true,
    });
  } catch (error) {
    if (username === '') {
      res.status(400).json({
        message: 'Validation failed: provide username',
        response: error,
        success: false,
      });
    } else if (error.code === 11000 && error.keyPattern.username) {
      res.status(400).json({
        message: 'Validation failed: username already exist',
        response: error,
        success: false,
      });
    } else if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({
        message: 'Validation failed: email already exist',
        response: error,
        success: false,
      });
    } else if (password === '') {
      res.status(400).json({
        message: 'Validation failed: provide password',
        response: error,
        success: false,
      });
    } else if (firstName === '') {
      res.status(400).json({
        message: 'Validation failed: provide first name',
        response: error,
        success: false,
      });
    } else if (lastName === '') {
      res.status(400).json({
        message: 'Validation failed: provide last name',
        response: error,
        success: false,
      });
    }
  }
});

// --- signin --- //
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        response: {
          userId: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accessToken: user.accessToken,
          role: user.role,
        },
        success: true,
      });
    } else {
      if (username === '') {
        res.status(404).json({
          message: 'Login failed: fill in username',
          response: 'Login failed: fill in username',
          success: false,
        });
      } else if (password === '') {
        res.status(404).json({
          message: 'Login failed: fill in password',
          response: 'Login failed: fill in password',
          success: false,
        });
      } else {
        res.status(404).json({
          message: 'Login failed: wrong username or password',
          response: 'Login failed: wrong username or password',
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: 'Invalid entry',
      response: error,
      success: false,
    });
  }
});

// -- add profile picture -- //
app.post('/userpage/:id/image', parser.single('image'), async (req, res) => {
  const { id } = req.params;

  try {
    const updatedImage = await new Image({
      imageUrl: req.file.path,
    }).save();

    if (updatedImage) {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $set: { image: updatedImage },
      });
      res.status(200).json({
        response: updatedImage,
        success: true,
      });
    } else {
      res.status(404).json({ response: 'Image not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// GET the user image //
app.get('/userpage/:id/image', async (req, res) => {
  const { id } = req.params;

  try {
    const queriedUser = await User.findById(id).populate('image');
    if (queriedUser) {
      res.status(200).json({ response: queriedUser.image, success: true });
    } else {
      res.status(404).json({ response: 'User not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

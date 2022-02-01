import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import multer from 'multer';
import cloudinaryFramework from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/finalProject';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useCreateIndex', true); //added due to deprecation error 26868
mongoose.Promise = Promise;

// -- cloudinary setup to store images -- //
// const cloudinary = cloudinaryFramework.v2;
// cloudinary.config({
//   cloud_name: 'minechies',
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = cloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'profileImages',
//     allowedFormats: ['jpg', 'png', 'jpeg'],
//     transformation: [{ width: 100, height: 100, crop: 'limit' }],
//   },
// });
// const parser = multer({ storage });

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
});

// a schema to add the rating to the database
const RatingSchema = new mongoose.Schema({
  ratingText: {
    type: String,
    required: true,
    trim: true,
    createdAt: {
      type: Date,
      default: () => new Date(), // could also pass Date.now and change the type to Number
    },
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
  radioInput: {
    type: String,
    possibleValues: ['Yes', 'No'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// --- models --- //
const User = mongoose.model('User', UserSchema);
const Rating = mongoose.model('Rating', RatingSchema);

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing

app.use(cors());
app.use(express.json());
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

// --- POST to feed --- //
// add the POPULATE here
app.post('/feed', authenticateUser);
app.post('/feed', async (req, res) => {
  // const { id } = req.params;
  // console.log(req.user);
  // console.log(req.user._id);
  const {
    ratingText,
    restaurantName,
    selectRating,
    selectCategory,
    radioInput,
    user,
  } = req.body;

  try {
    const newRatingText = await new Rating({
      ratingText,
      restaurantName,
      selectRating,
      selectCategory,
      radioInput,
      user,
    }).save();
    // const updatedUser = await User.findByIdAndUpdate(id, {
    //   $push: { rating: newRatingText },
    // });
    // res.status(201).json({ response: updatedUser, success: true });
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
  const main = await Rating.find({}).sort({ ratingText: -1 });

  res
    .status(201)
    .json({ response: main, success: true, message: 'the rating feed' });
});

// --- get USER profile info --- //
app.get('/userpage/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await User.findById(userId);
    res.status(200).json({
      response: profile,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// -- PATCH user info -- //
app.patch('/user', async (req, res) => {
  // req.query - ?user=id?
  const userId = req.query.id;

  try {
    // salt -> randomizer
    const salt = bcrypt.genSaltSync();
    // if user change password -> hashing the password
    // if the req.body.password is empty (no change at all by user) -> delete the req.body
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    } else {
      delete req.body.password;
    }
    // console.log(req.body)

    const updatedUserProfile = await User.findOneAndUpdate(
      { _id: userId },
      req.body,
      { new: true, useFindAndModify: false }
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
app.get('/feed/:userId', async (req, res) => {
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

// -- for the search path of restaurants -- //
app.get('/restaurant', async (req, res) => {
  // on FE /restaurant?username=${name} or restaurantName
  const restaurantName = req.query.restaurantName;
  // const username = req.query.username

  const findRestaurant = await Rating.find({ restaurantName: restaurantName });
  try {
    if (findRestaurant.length > 0) {
      res.status(200).json({
        response: findRestaurant,
        success: true,
      });
    } else {
      res
        .status(404)
        .json({ response: 'restaurant not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// --- delete feed, maybe not neccesary?--- //
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
//app.delete('/feed/:userId', authenticateUser);
app.delete('/userpage/:userRatingId', async (req, res) => {
  const { userRatingId } = req.params; // body or params?
  // const { user } = req.body;
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
  const { username, password, email, firstName, lastName } = req.body;

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
    }).save();

    res.status(201).json({
      response: {
        userId: newUser._id,
        username: newUser.username,
        accessToken: newUser.accessToken,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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
    } else {
      res.status(400).json({
        message: 'Validation failed: please provide username and password',
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
// app.post('/userpage/image', authenticateUser);
// app.post('/userpage/image', parser.single('image'), async (req, res) => {
//   const userId = req.user.id;
//   try {
//     await User.findOneAndUpdate(
//       { userId },
//       { profileImageUrl: req.file.path },
//       { new: true }
//     );
//     res.status(200).json({ success: 'Profile picture added' });
//   } catch (error) {
//     res.status(400).json({
//       message:
//         'Sorry, could not save profile picture, formats allowed: png, jpg or jpeg',
//     });
//   }
// });

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

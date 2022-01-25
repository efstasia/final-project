import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/finalProject';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useCreateIndex', true); //added due to deprecation error 26868
mongoose.Promise = Promise;

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
    enum: ['Pizza', 'Pasta', 'Hamburger', 'Sushi'],
    default: 'Pizza',
    required: true,
  },
  radioInput: {
    type: String,
    possibleValues: ['Yes', 'No'],
  },
  ratingBy: {
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
app.post('/feed', authenticateUser);
app.post('/feed', async (req, res) => {
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
      user: req.user,
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
  const main = await Rating.find({}).sort({ ratingText: -1 });

  res
    .status(201)
    .json({ response: main, success: true, message: 'the rating feed' });
});

// --- this POSTS the ratings to the USER page --- //
//app.post('/userpage', authenticateUser);
app.post('/userpage', async (req, res) => {
  // '/ratings/:userId'
  // const { userId } = req.params;
  const {
    ratingText,
    restaurantName,
    selectRating,
    selectCategory,
    radioInput,
    // user: req.user
    // userId, // is this needed?
  } = req.body;

  try {
    const newUserRatingText = await new Profile({
      ratingText,
      restaurantName,
      selectRating,
      selectCategory,
      radioInput,
      user: req.user,
    }).save();
    res.status(201).json({
      response: newUserRatingText,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
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

app.get('/feed/:userId', async (req, res) => {
  const { userId } = req.params;

  const profile = await Rating.findById(userId);
  try {
    if (profile) {
      res.status(200).json({
        response: {
          ratingText,
          restaurantName,
          selectRating,
          selectCategory,
          radioInput,
          userId,
        },
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// -- GET the users own ratings -- //
// app.get('/feed/:userId', authenticateUser);
// app.get('/feed/:userId', async (req, res) => {
//   const { userId } = req.params;

//   const ratings = await Rating.find({ user: userId }).sort({
//     createdAt: 'desc',
//   });
//   res.status(201).json({ response: ratings, success: true });
//   console.log(userId);
// });

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
app.delete('/userpage/:userId', async (req, res) => {
  const { userId } = req.params; // body or params?
  // const { user } = req.body;

  try {
    //const userRatings = await User.findById(user);
    const deletedUserRating = await Profile.findOneAndDelete({
      _id: userId,
    });
    if (deletedUserRating) {
      res.status(200).json(deletedUserRating);
    } else {
      res.status(404).json({ message: `rating by id ${userId} not found` });
    }
  } catch (err) {
    res.status(400).json({ message: 'could not delete', error: err });
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

// --- TRIED TO CRATE THE SEARCH BAR --- //
// app.get('/ratings/:restaurantName', authenticateUser);
// app.get('/ratings/:restaurantName', async (req, res) => {
//   const restaurantName = req.params;

//   try {
//     const restaurant = await Rating.findOne({ restaurantName });
//     if (restaurant) {
//       res
//         .status(201)
//         .json({ response: restaurant, message: 'here is your restaurant' });
//     }
//   } catch (error) {
//     res.status(400).json({ response: error, success: false });
//   }
// });

// add a GET for ratings/restaurant

// do we really need two endpoints to GET either user ratings or feed ratings?

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

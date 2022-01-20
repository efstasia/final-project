import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/authAPI';
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
const User = mongoose.model('User', UserSchema);

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
});

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

// not sure what this does
// app.get('/main', authenticateUser);
// app.get('/main', async (req, res) => {
//   const main = await User.find({});
//   res
//     .status(201)
//     .json({ response: main, success: true, message: 'our secret page' });
// });

app.get('/ratings', authenticateUser);
app.get('/ratings', async (req, res) => {
  const main = await Rating.find({}).sort({ ratingText: -1 });

  res
    .status(201)
    .json({ response: main, success: true, message: 'our secret page' });
});

app.post('/ratings', async (req, res) => {
  const {
    ratingText,
    restaurantName,
    selectRating,
    selectCategory,
    radioInput,
  } = req.body;

  try {
    const newRatingText = await new Rating({
      ratingText,
      restaurantName,
      selectRating,
      selectCategory,
      radioInput,
    }).save();
    res.status(201).json({
      response: newRatingText,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.delete('/ratings/:ratingId', async (req, res) => {
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

//  res.status(400).json({ response: error, success: false }); OUR ORIGINAL CODE INSIDE THE CATCH

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

//   res.status(403).json({ message: 'error', response: error, success: false });

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

import { Router } from 'express';
import User from '../models/user.model';
import mongoose from 'mongoose';
const router = Router();

export interface UserTypes {
  _id: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string
}

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.find({});
  res.status(200).json(users);
});

/* GET user by id. */
router.get('/:id', async function (req, res, next) {
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

/* POST create user. */
router.post('/', async function (req, res, next) {
  const { name, email, password } = req.body;

  const newUser = { name, email, password };
  try {
    const user = new User(newUser);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json('Delected successfully')
  } catch (err) {
    res.status(422).json(err)
  }
})

module.exports = router;

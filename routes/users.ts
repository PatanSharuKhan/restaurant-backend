import { Router } from 'express';
const router = Router();

const users = [
  { id: 1, name: 'Alice', email: 'alice@gmail.com' }
]

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.status(200).json(users);
});

/* GET user by id. */
router.get('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

/* POST create user. */
router.post('/', function (req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ message: 'Invalid request' });
  } else {
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

module.exports = router;

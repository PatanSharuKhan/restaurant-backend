import { Router } from 'express';
import User from '../models/user.model';
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    if (user.password === password) {
      const jwtToken = 'jwt-token'
      res.status(200).json(jwtToken)
    } else {
      res.status(422).json('Invalid Password')
    }
  } else {
    res.status(422).json('Invalid Credentials')
  }
})

module.exports = router;

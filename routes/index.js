const ObjectID = require('mongodb').ObjectID;

const User = require('../db/User');
const Poll = require('../db/Poll');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = app => {
  app.get('/', (req, res) => {
    Poll.find({})
      .populate('polls')
      .then(polls => {
        if (!req.user) {
          res.render('index', { polls });
        } else {
          res.render('index', { polls, user: req.user });
        }
      })
      .catch(err => err);
  });

  app.get('/poll/:id', (req, res) => {
    let { id } = req.params;
    let pollId = ObjectID(id);

    Poll.findById(pollId)
      .then(poll => {
        if (req.user) {
          return res.render('pollpage', { poll, user: req.user });
        }
        res.render('pollpage', { poll });
      })
      .catch(err => err);
  });

  app.get('/poll/:pollid/:optionid', (req, res) => {
    let { pollid, optionid } = req.params;

    Poll.findById(pollid)
      .then(poll => {
        poll.options.forEach((val, i) => {
          if (val._id.toString() === optionid.toString()) {
            val.votes += 1;
          }
        });
        poll.save();

        res.send(poll);
      })
      .catch(err => err);
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    let { user } = req;

    User.findById(user._id)
      .populate('polls')
      .then(returnedUser => {
        res.render('profile', {
          polls: returnedUser.polls,
          user: returnedUser
        });
      })
      .catch(err => err);
  });

  app.get('/profile/create', isLoggedIn, (req, res) => {
    res.render('createPoll');
  });

  app.post('/profile/create', isLoggedIn, (req, res) => {
    let { user } = req;
    let { title, options } = req.body;
    let optionsArr = options.split(',').map((val, i) => {
      return {
        option: val,
        votes: 0
      };
    });

    User.findById(user._id)
      .populate('polls')
      .then(user => {
        let id = ObjectID(user._id);
        let newUserPolls;

        newPoll = new Poll({
          title,
          options: optionsArr,
          creator: id
        });

        user.polls.push(newPoll);

        newPoll.save();
        user.save();
        res.redirect('/profile');
      })
      .catch(err => err);
  });

  app.get('/edit/:id', isLoggedIn, (req, res) => {
    let { id } = req.params;
    let pollId = ObjectID(id);
    let { user } = req;

    Poll.findById(pollId)
      .then(poll => {
        res.render('editPoll', { poll, user });
      })
      .catch(err => err);
  });

  app.patch('/edit/:id', isLoggedIn, (req, res) => {
    let { user } = req;
    let { id } = req.params;
    let { title, options } = req.body;
    let optionsArr;

    Poll.findByIdAndUpdate(id, { $set: { title } })
      .then(() => Poll.findById(id))
      .then(poll => {
        if (options != null) {
          optionsArr = options.split(',').map((val, i) => {
            return {
              option: val,
              votes: 0
            };
          });
          optionsArr.forEach(val => {
            poll.options.push(val);
          });
          poll.save();
          return res.redirect('/profile');
        } else {
          res.redirect('/profile');
        }
      })
      .catch(err => err);
  });
};

const db = require('./database/toDoModels.js');
//gives us access to our database/pool so that we can query it

const toDoController = {};

toDoController.createTask = function(req, res, next) {
  console.log('req.body: ', req.body);
  //when the client side makes a post request to our server, their input comes in via the body property in the req object
  // we'll call the incoming todo "task" which will come in as a key:value pair in our body object
  const { task } = req.body;
  //   console.log('req.body.task: ', req.body.task);
  //destructure our req.body object and pull out the task property and its value
  //template literals are not recommended for queryStrings
  const arr = [task];
  //arr is an array holding one value - the task we've pulled out of the req.body
  const queryString = 'INSERT INTO toDo (tasks) VALUES ($1)';
  db.query(queryString, arr, (err) => {
    if (err) {
      return next({
        log: 'error adding new task to db',
        message: { err }
      });
    }
    return next();
  });
};

toDoController.getAllTasks = function(req, res, next) {
  const queryString = 'select * from toDo';
  //queryString
  db.query(queryString, (err, response) => {
    //the callback functions in this query are asynchronous and will wait for the response from the database. Alternatively we can use promises or async/await
    if (err) {
      return next({
        log: 'error in getAllTasks',
        message: { err }
      });
    } else {
      console.log(
        'allTasks from getAllTasks from response.rows ',
        response.rows
      );
      res.locals.allTasks = response.rows;
      return next();
    }
  });
};

toDoController.deleteTask = function(req, res) {
  //we have to receive something in our req.body that tells us the user wants to delete something from the db
  const { id } = req.body;
  const arr = [id];
  const queryString = 'DELETE from toDo WHERE id=$1';
  db.query(queryString, arr, (err) => {
    if (err) {
      return next({
        log: 'error in getAllTasks',
        message: { err }
      });
    }
  });
  return next();
};

toDoController.updateTask = function(req, res) {
  //we'll need the id in order to grab onto the specific row we need to update
  const queryString = 'UPDATE toDo SET tasks = $2 WHERE id = $1';
  // UPDATE table-name SET column-name = position-in-array WHERE
  const { id, task } = req.body;
  const updateArr = [id, task];
  db.query(queryString, updateArr, (err) => {
    if (err) {
      return next({
        log: 'error in getAllTasks',
        message: { err }
      });
    }
  });
  return next();
};

//middleware for handling user signup
toDoController.newUser = function(req, res, next) {
  const { userName } = req.body;
  const insertUser = [userName];
  console.log('req.body username in newUser: ', req.body.userName);
  const queryString = 'INSERT INTO userTable (userName) VALUES($1)';
  db.query(queryString, insertUser, (err) => {
    if (err) {
      return next({
        log: 'error in newUser',
        message: { err }
      });
    }
    return next();
  });
};

toDoController.setCookie = function(req, res, next) {
  //middleware to add a cookie to the browser that will last for 10 seconds
  res.cookie('Authed', true, { maxAge: 20000 });
  return next();
};

toDoController.checkCookie = function(req, res, next) {
  //the req object has a cookies property on it. The cookies property will have every cookie in it that the client has
  const cookies = req.cookies;
  //   console.log('req.cookies in checkCookies', cookies);
  //check to see if the client already has a cookie named "authed" active. If so, move onto the next middleware function.
  if (cookies['Authed'] === 'true') {
    return next();
  } else {
    //if the client doesn't have a cookie, send a message to the FE that they need to sign in
    res.json({ message: 'Sign in dude' });
  }

  return next();
};

module.exports = toDoController;

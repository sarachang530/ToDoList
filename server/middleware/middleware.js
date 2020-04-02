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

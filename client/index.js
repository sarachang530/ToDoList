console.log('index.js is working');
// best practice would be to add all js code in an immediately invoked function which would be executed as soon as the document has loaded

document.addEventListener('DOMContentLoaded', () => {
  //adding an event listener that fetches all the current tasks in the database to render to the page via a fetch request to our db
  fetch('/toDo')
    .then((data) => data.json())
    .then((tasks) => {
      appendDOM(tasks);
      console.log('tasks from DOMContentLoaded: ', tasks);
    });
});

//below is a helper function that creates the elements that will be added to our webpage. We'll pass it into our fetch request in order to loop through the tasks we receive from the fetch request and then create a new div full of task divs
function appendDOM(tasks) {
  const taskDiv = document.createElement('div');
  //taskDiv will hold all of the individual task divs. We append a new div inside of taskDiv by looping through all of the tasks from our database, looping through that array in our forEach, and creating a bunch of html elements inside that forEach that get added to the new array.
  tasks.forEach((task) => {
    //in the forEach we create new elements by looping through the array of tasks we get back from our fetch
    const div = document.createElement('div');
    const paragraph = document.createElement('p');
    const updateButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    console.log('task.tasks in helper function: ', task.tasks);
    //updateButton.innerText = 'Update' adds text to the buttons
    updateButton.innerText = 'Update';
    deleteButton.innerText = 'Delete';
    paragraph.innerText = task.tasks;
    //updating the text that the paragraph will hold to be the value of one task
    updateButton.setAttribute('data-id', task.id);
    deleteButton.setAttribute('data-id', task.id);
    updateButton.setAttribute('class', 'update');
    deleteButton.setAttribute('class', 'delete');
    div.appendChild(paragraph);
    div.appendChild(updateButton);
    div.appendChild(deleteButton);
    // div.setAttribute()
    taskDiv.appendChild(div);
  });
  //appends the list of task divs on the body of our page
  document.body.appendChild(taskDiv);
}

//[bubbling] adding a global event listener to the body. When the user clicks on a specific button, event.target will be equal to the unique task (showing a unique id) so that we can grab onto it and delete/update, etc.
document.body.addEventListener('click', (event) => {
  const target = event.target;
  //the if logic will catch whenever someone clicks on an actual button instead of just anywhere on the page
  if (target.className === 'delete') {
    //fetch takes an option object which is where we specify the specific method that should be actioned
    fetch('/toDo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: target.dataset.id
      })
    });
  }
  //   if (target.className === 'update') {
  //   }
});

const userForm = document.querySelector('#auth');
userForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userName = event.target[0].value;
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName })
  })
    .then()
    .then()
    .catch((err) => console.log(err));
});

const taskForm = document.querySelector('#task');
//have to use # to grab onto ids and . to grab onto classes
console.log('taskForm: ', taskForm);

taskForm.addEventListener('submit', (event) => {
  //once we click a button we get access to an event object which we pass into our addEventListener function
  event.preventDefault();
  //prevents the submission of form from re-rendering the entire page
  //event.target is an array. event.target[0] should be the value of whatever is captured in the input
  console.log('event.target[0].value ', event.target[0].value);
  //fetch allows us to talk between our front and back ends.
  const task = event.target[0].value;
  //   console.log('task before fetch: ', task);
  //store the input value in a variable called task so that we can add that to our db when a user submits a new task
  const jsonString = JSON.stringify({ task });
  fetch('/toDo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonString
  })
    .then((data) => data.json())
    .then((task) =>
      console.log('tasks from fetch request in button handler: ', task)
    );
});

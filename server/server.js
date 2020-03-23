const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

//create read update delete

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'))
});

app.get('/getTask', (req, res) => {
  res.status(200).send('task sent!')
});


app.post('/createTask', (req, res) => {
  res.status(200).send('post req successful')
});

app.put('/updateTask', (req, res) => {
  res.status(200).send('put req successful!')
})

app.delete('/deleteTask', (req, res) => {
  res.status(200).send('delete successful!')
});


app.use(express.static('public'));





app.listen(PORT, () => console.log(`${PORT}`));
module.exports = app;

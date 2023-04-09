const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');           
const { Double } = require('mongodb');
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;

const MongoClient = require('mongodb').MongoClient; 
const ObjectID = require('mongodb').ObjectId;

const client = new MongoClient(url);
client.connect();

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error

  const { userId, card } = req.body;

  const newCard = {Card:card,UserId:userId};
  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  cardList.push( card );

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  //incoming : 
  //outgoing: stores FirstName, LastName, Mail, Login, Password

  const {firstName, lastName, password, email} = req.body;

  if (!firstName || !lastName || !password || !email)
  {
    return res.status(500).json({ error: "Please fill in all the details" });
  }

  const newUser = {FirstName:firstName, LastName:lastName, Password:password, Mail:email};
  var error = '' ;

  try
  {
    const db = client.db("COP4331");

    const userExists = await db.collection('Users').findOne({Mail: email});
    if (userExists)
    {
      return res
          .status(422)
          .json({ error: "Email already exists" });
    }

    const result = db.collection('Users').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.post('/api/addtransaction', async (req, res, next) =>
{
  const {email, name, amount, category, date} = req.body;
  const newTransaction = {Mail: email, transName: name, transAmount: amount, transCat: category, transDate: date};
  var error = '' ;

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Transactions').insertOne(newTransaction);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.get('/api/loadtransactions', async (req, res) => {
  const { email } = req.query;
  let transactions = [];
  let error = '';

  try {
    const db = client.db('COP4331');
    transactions = await db.collection('Transactions').find({ Mail: email }).toArray();
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ transactions, error });
});

app.delete('/api/deletetransaction/:id', async (req, res, next) =>
{
  const {id} = req.params;
  const filter = { _id: new ObjectID(id)};

  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = await db.collection('Transactions').deleteOne(filter);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.post('/api/createfinance', async (req, res, next) =>
{
  //incoming : email
  //outgoing: stores monthlyIncome, monthlySaving, monthlyBills

  const {incomeMonthly, savingsMonthly, email} = req.body;
  const newFinance = {monthlyIncome: incomeMonthly, monthlySaving: savingsMonthly, monthlyBills: incomeMonthly - savingsMonthly, Mail:email};
  var error = '' ;

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Finances').insertOne(newFinance);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.put('/api/updatefinance', async (req, res, next) =>
{
  const {_id, incomeMonthly, savingsMonthly, } = req.body;

  const filter = { _id: new ObjectID(_id)};
  const update = { $set: {monthlyIncome: incomeMonthly, monthlySaving: savingsMonthly, monthlyBills: incomeMonthly - savingsMonthly}};
  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Finances').updateOne(filter, update);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.put('/api/deletefinance', async (req, res, next) =>
{
  const {_id} = req.body;
  const filter = { _id: new ObjectID(_id)};

  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Finances').deleteOne(filter);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.post('/api/creategoal', async (req, res, next) =>
{
  //incoming : 
  //outgoing: stores metGoal, desiredSaving

  const {savingsdesired, currentAmount, email, nameOfGoal} = req.body;
  const newGoal = {metGoal : savingsdesired <= currentAmount, desiredSavings: savingsdesired, currAmount: currentAmount, Mail:email, Name: nameOfGoal };
  var error = '' ;

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Goals').insertOne(newGoal);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.put('/api/updategoal', async (req, res, next) =>
{
  const {_id, savingsdesired, currentAmount, nameOfGoal} = req.body;

  const filter = { _id: new ObjectID(_id)};
  const update = { $set: {metGoal: savingsdesired <= currentAmount, desiredSavings: savingsdesired, currAmount: currentAmount, Name: nameOfGoal}};

  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Goals').updateOne(filter, update);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.put('/api/deletegoal', async (req, res, next) =>
{
  const {_id} = req.body;
  const filter = { _id: new ObjectID(_id)};

  var error = '';

  try
  {
    const db = client.db("COP4331");
    const result = db.collection('Goals').deleteOne(filter);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  var error = '';

  const { email, password } = req.body;

  const db = client.db("COP4331");
  const results = await db.collection('Users').find({Mail:email,Password:password}).toArray();

  var mail = '';
  var fn = '';
  var ln = '';

  if( results.length > 0 )
  {
    mail = results[0].Mail;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }

  var ret = { email:mail, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

// JOSH PLAYGROUND
app.get('/api/checkgoal', async (req, res) =>
{
  var error = '';

  const { email } = req.query;

  const db = client.db("COP4331");
  const result = await db.collection('Goals').findOne({ Mail: email });

  res.json(result != null);
});

app.get('/api/loadgoal', async (req, res) =>
{
  var error = '';

  const { email } = req.query;

  const db = client.db("COP4331");
  const result = await db.collection('Goals').findOne({ Mail: email });

  let currAmount = result ? result.currAmount : null;
  let desiredSavings = result ? result.desiredSavings : null;
  let nameOfGoal = result ? result.Name : null;
  let idOfGoal = result ? result._id : null;

  var ret = { currAmount: currAmount, desiredSavings: desiredSavings, Name: nameOfGoal, _id: idOfGoal, error:''};
  res.status(200).json(ret);

});


app.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => 
  {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

module.exports = express.Router();

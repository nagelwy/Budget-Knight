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

  const {savingsdesired, currentAmount, email} = req.body;
  const newGoal = {metGoal : savingsdesired <= currentAmount, desiredSavings: savingsdesired, currAmount: currentAmount, Mail:email };
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
  const {_id, savingsdesired, currentAmount} = req.body;

  const filter = { _id: new ObjectID(_id)};
  const update = { $set: {metGoal: savingsdesired <= currentAmount, desiredSavings: savingsdesired, currAmount: currentAmount}};

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
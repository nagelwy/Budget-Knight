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

const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const secretKey = 'test';

app.post('/api/verification', async (req, res, next) => {

  var error = '';

  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "72aa4d60c1264f", // generated ethereal user
      pass: "80f29a38f9515d", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'info@mailtrap.club', // sender address
    to: "nagelwyatt@yahoo.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => {
  //incoming :
  //outgoing: stores FirstName, LastName, Mail, Login, Password

  const { firstName, lastName, password, email } = req.body;

  if (!firstName || !lastName || !password || !email) {
    return res.status(500).json({ error: "Please fill in all the details" });
  }

  const token = jwt.sign({ email }, secretKey);

  const newUser = {
    FirstName: firstName,
    LastName: lastName,
    Password: password,
    Mail: email,
    JWToken: token,  
    isVerified: false,
    currentBalance: 0,
  };

  var error = '';

  try {
    const db = client.db("COP4331");

    const userExists = await db.collection('Users').findOne({ Mail: email });
    if (userExists) {
      return res.status(422).json({ error: "Email already exists" });
    }

    // Add the user to the 'Users' collection
    const result = await db.collection('Users').insertOne(newUser);

    // Create a new document in the 'CategoryTotals' collection for the user
    const newCategoryTotals = {
      Mail: email,
      totalGroc: 0,
      totalRent: 0,
      totalRes: 0,
      totalEating: 0,
      totalFun: 0,
      totalGoal: 0,
    };

    await db.collection('CategoryTotals').insertOne(newCategoryTotals);
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/addtransaction', async (req, res, next) => {
  const { email, name, amount, category, date } = req.body;
  const newTransaction = { Mail: email, transName: name, transAmount: amount, transCat: category, transDate: date };
  var error = '';

  try {
    const db = client.db("COP4331");
    const result = db.collection('Transactions').insertOne(newTransaction);

    // Determine whether to add or subtract the transaction amount from the user's currentBalance
    const balanceChange = category === "Income" ? parseFloat(amount) : -parseFloat(amount);

    // Update the user's currentBalance
    const updateResult = await db.collection('Users').findOneAndUpdate(
      { Mail: email },
      { $inc: { currentBalance: balanceChange } },
      { returnDocument: 'after' }
    );

    // Check if the update was successful
    if (!updateResult || !updateResult.value) {
      throw new Error('Failed to update user balance');
    }

    // If the category is not "Income", update the corresponding category total in the CategoryTotals collection
    if (category !== "Income") {
      const categoryMapping = {
        "Groceries": "totalGroc",
        "Rent/Utilities": "totalRent",
        "Eating Out": "totalEating",
        "Fun Misc.": "totalFun",
        "Responsibilities": "totalRes",
      };

      const categoryTotalField = categoryMapping[category];

      if (categoryTotalField) {
        const categoryUpdateResult = await db.collection('CategoryTotals').findOneAndUpdate(
          { Mail: email },
          { $inc: { [categoryTotalField]: parseFloat(amount) } },
          { returnDocument: 'after' }
        );

        // Check if the category update was successful
        if (!categoryUpdateResult || !categoryUpdateResult.value) {
          throw new Error(`Failed to update ${category} total`);
        }
      }
    }

    // If the category is "Goal", update the currAmount in the Goals collection
    if (category === "Goal") {
      const goalUpdateResult = await db.collection('Goals').findOneAndUpdate(
        { Mail: email },
        { $inc: { currAmount: parseFloat(amount) } },
        { returnDocument: 'after' }
      );

      // Check if the goal update was successful
      if (!goalUpdateResult || !goalUpdateResult.value) {
        throw new Error('Failed to update goal amount');
      }
    }

  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
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

app.delete('/api/deletetransaction/:id', async (req, res, next) => {
  const { id } = req.params;
  const filter = { _id: new ObjectID(id) };

  var error = '';

  try {
    const db = client.db("COP4331");
    const transactionToDelete = await db.collection('Transactions').findOne(filter);

    if (transactionToDelete) {
      const userFilter = { Mail: transactionToDelete.Mail };
      const amount = parseFloat(transactionToDelete.transAmount);

      // Determine whether to add or subtract the transaction amount from the user's currentBalance
      const balanceChange = transactionToDelete.transCat === "Income" ? -amount : amount;

      const update = {
        $inc: { currentBalance: balanceChange },
      };

      // Update the user's currentBalance
      await db.collection('Users').updateOne(userFilter, update);

      // If the transaction category is not "Income", update the corresponding category total in the CategoryTotals collection
      if (transactionToDelete.transCat !== "Income") {
        const categoryMapping = {
          "Groceries": "totalGroc",
          "Rent/Utilities": "totalRent",
          "Eating Out": "totalEating",
          "Fun Misc.": "totalFun",
          "Responsibilities": "totalRes",
          "Goal": "totalGoal",
        };

        const categoryTotalField = categoryMapping[transactionToDelete.transCat];

        if (categoryTotalField) {
          const categoryUpdateResult = await db.collection('CategoryTotals').findOneAndUpdate(
            { Mail: transactionToDelete.Mail },
            { $inc: { [categoryTotalField]: -amount } },
            { returnDocument: 'after' }
          );

          // Check if the category update was successful
          if (!categoryUpdateResult || !categoryUpdateResult.value) {
            throw new Error(`Failed to update ${transactionToDelete.transCat} total`);
          }
        }
      }

      // If the transaction category is "Goal", subtract the transaction amount from the currAmount in the Goals collection
      if (transactionToDelete.transCat === "Goal") {
        await db.collection('Goals').updateOne(
          { Mail: transactionToDelete.Mail },
          { $inc: { currAmount: -amount } }
        );
      }

      // Delete the transaction
      await db.collection('Transactions').deleteOne(filter);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
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
  var cb = 0;

  if( results.length > 0 )
  {
    mail = results[0].Mail;
    fn = results[0].FirstName;
    ln = results[0].LastName;
    cb = results[0].currentBalance
  }

  var ret = { email:mail, firstName:fn, lastName:ln, currentBalance: cb, error:''};
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

app.get('/api/categorytotals', async (req, res) => {
  const { email } = req.query; // Assuming you pass the email as a query parameter
  const filter = { Mail: email };

  let categoryTotals = [];

  try {
    const db = client.db("COP4331");
    categoryTotals = await db.collection('CategoryTotals').findOne(filter);
  } catch (e) {
    console.error('Error fetching category totals:', e);
  }

  res.status(200).json(categoryTotals);
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

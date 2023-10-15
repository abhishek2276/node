const express = require('express')
const crypto = require('crypto');

const app = express()
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const secretKey = 'your-secret-key';
const Pool = require('pg').Pool
const pool = new Pool({
    host: 'localhost',
        port: 5432,
        database: 'login',
        user: 'postgres',
        password: 'Abhi@2001',
}) 

app.use(bodyParser.json());

// Replace this with your actual secret key

console.log(secretKey);
// Function to issue a JWT token when the user logs in
function issueToken(userCRN) {
  return jwt.sign({ crn: userCRN }, secretKey, { expiresIn: '1h' }); // Set an expiration time as needed
}
function generateCRN() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `CRN${timestamp}${randomNum}`;
  }
  app.post('/users', (req, res) => {
    const { phonenumber, password } = req.body;
   
    try {
      const crnNumber = generateCRN();
  
      pool.query(
        'INSERT INTO main2 (phonenumber, password, crn_number) VALUES ($1, $2, $3)',
        [phonenumber, password, crnNumber]
      );
   
      res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }); 
  app.get('/validateToken', (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is invalid' });
      }
  
      // Token is valid, you can proceed with the request
      const userCRN = decoded.crn;
      // You can fetch user data from the CRN and send it back if needed
      res.json({ userCRN });
    });
  });
  function generateAccessToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: '24h' });
  }
  const authenticateUser = (request, response) => {
    const { phonenumber, password } = request.body;
  
    pool.query(
      'SELECT * FROM main2 WHERE phonenumber = $1 AND password = $2',
      [phonenumber, password],
      (error, results) => {
        if (error) {
          throw error; 
        }
  
        if (results.rows.length === 0) {
          // Authentication failed
          response.status(401).json({ message: 'Please enter valid details and try again' });
        } else {
          // Authentication successful, return user data
          const user = results.rows[0];
          const token = generateAccessToken({ user });
          response.status(200).json({ message: 'Authentication successful', user,token });
          console.log('Sent user data:', user);

        }
      }
      );
    };
const getUsers = (request, response) => {
    pool.query('SELECT * FROM main2   ', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM main2 WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
} 
const createUser = (request, response) => {
    const {
       
        phonenumber,
        password,
      
         
    } = request.body
    const crn = generateCRN(); 
    pool.query('INSERT INTO main2 (   phonenumber,password, crn ) VALUES ($1, $2,$3)', [  phonenumber,password,crn], (error, results) => {
        if (error) {  
            throw error
        }
        response.status(200).send(`User added with ID: ${results.insertId}`)
    })
}
const updateUser = (request, response) => { 
    const id = parseInt(request.params.id)
    const {
        
        username,
        password,crn,
    } = request.body
    pool.query(
        'UPDATE main2SET  username = $2, password = $3,crn=$4 WHERE id = $1',
        [id, username, password,crn],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${results.id}`)
        }
    )
}
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM main2 WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${results.id}`)
    })
}
module.exports = {
    getUsers,
    authenticateUser, 
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}
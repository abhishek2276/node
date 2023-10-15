const { response } = require('express')
const session = require('express-session');
const express = require('express')

const app = express();

// Initialize express-session to manage sessions
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

const Pool=require('pg').Pool
const pool=new Pool({
     host: 'localhost',
        port: 5432,
        database: 'login',
        user: 'postgres',
        password: 'Abhi@2001',
})
pool.connect((err) => {
    if (err) {
      console.error('Database connection error: ' + err.message);
      return;
    }
    console.log('Connected to the database');
  });
  
  // Middleware to ensure the user is authenticated and retrieve the CRN from the session
  app.use((req, res, next) => {
    if (req.session && req.session.crn) {
      res.locals.crn = req.session.crn; // Make CRN available to routes
    }
    next();
  });
  const authenticateUser = (request, response) => {
    const { phonenumber, password } = request.body;
  
    pool.query(
      'SELECT phonenumber,password FROM agent WHERE phonenumber = $1 AND password = $2',
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
          response.status(200).json({ message: 'Authentication successful', user });
        }
      }
      );
    };

    const getInfo=(request,response)=>{
      const { crn} =request.query;
      console.log(crn)
      pool.query('select phonenumber from agent where crn=$1',[crn],(error,results)=>{
          if(error){
              throw error
          } 
          const phonenumbers = results.rows.map((row) => row.phonenumber);
          response.json(phonenumbers);
      })
  } 
  const getAgent=(request,response)=>{
    const { crn,phonenumber} =request.query;
    console.log(crn,phonenumber)
    pool.query('select * from agent where crn=$1 and phonenumber=$2',[crn,phonenumber],(error,results)=>{
        if(error){
            throw error 
        } 
        response.status(200).json(results.rows)
console.log(results.rows)
    })
}  
  const getAgentInfo=(request,response)=>{
    const { crn } = request.query;
    console.log(`Fetching data for date range: ${crn}`); // Add a log statement to check query parameters

    pool.query('select "agentType",name,phonenumber,village,district,state from agent where crn=$1',[crn],(error,results)=>{
        if(error){ 
            throw error
        } 
        response.status(200).json(results.rows)
console.log(results.rows)
    })
}
const getAgentInfo1 = (request, response) => {
  const { crn, phonenumber } = request.query;
  console.log(`Fetching data for CRN: ${crn} and Phone Number: ${phonenumber}`); // Log the CRN and phone number

  pool.query(
    'SELECT "agentType", name, phonenumber, village, district, state FROM agent WHERE crn = $1 AND phonenumber = $2',
    [crn, phonenumber],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
      console.log(results.rows);
    }
  );
};

const getAgentType = (request, response) => {
  const { phonenumber } = request.query; // Change agentType to phonenumber
  console.log(`Fetching data for phone number: ${phonenumber}`);

  pool.query('SELECT "agentType",name,phonenumber,crn FROM agent WHERE "phonenumber"= $1', [phonenumber], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
    console.log(results.rows)
  });
};
const getTrucks=(request,response)=>{ 
    const { crn } = request.query; 
    pool.query('select t1."truckNumber",t1. "truckMaxWeight",t1. "truckWheels",t1."truckFrontSideWithNumberPlate",t2."time",t2."from",t2."to", t2.date,t2."loadingSublocations",t2. "unloadingSublocations"  FROM truck AS t1 JOIN post1 AS t2 ON  t1."truckNumber" = t2."truckNumber" where t2.crn=$1', [crn],(error,results)=>{
        if(error){
            throw error
        } 
        console.log(response)
        response.status(200).json(results.rows)
    })
} 
const getOwner=(request,response)=>{
    pool.query('select * from agent ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
} 
const getOwnerById=(request,respose)=>{
    const id = parseInt(request.params.id)
    pool.query('select * from agent where id=$1',[id],(error,results)=>{
        if(error){
            throw error
        }
        
        respose.status(200).json(results.rows)
    })
}
const createOwner=(request,response)=>{
   const {  
    agentType,
    name,
    email,
    password,
    phonenumber,
    aadharNumber,  
    uploadAadhar, 
    doorNo,
    street,
    landmark,
    village,
    pincode,
    pancardNumber,
    uploadPan,
    mandal,
    crn, 
    state,
    district,
   
   }=request.body
   pool.query('insert into agent ("agentType", name, email, password, phonenumber, "aadharNumber", "uploadAadhar", "pancardNumber", "uploadPan", "doorNo", street, landmark, village, pincode, mandal, district, state, crn) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',[agentType, name, email, password, phonenumber, aadharNumber, uploadAadhar, pancardNumber, uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn],(error,results)=>{
    if(error){
        throw error
    }
    response.status(200).send(`Agent product add with id:${results.insertid}`)
   }) 
}
const updateOwner=(request,response)=>{
    const id=parseInt(request.params.id)
    const{ 
        agentType,
    name,
    email,
    password,
    phonenumber,
    aadharNumber,
    uploadAadhar,
    doorNo,
    street,
    landmark,
    village,
    pincode,
    pancardNumber,
    uploadPan,
    mandal,
    crn,
    state,
    district
    }=request.body
    pool.query('update agent set "agentType"=$2, name=$3, email=$4, password=$5, phonenumber=$6, "aadharNumber"=$7, "uploadAadhar"=$8, "pancardNumber"=$9, "uploadPan"=$10, "doorNo"=$11, street=$12, landmark=$13, village=$14, pincode=$15, mandal=$16, district=$17, state=$18, crn=$19 where id=$1',[agentType, name, email, password, phonenumber, aadharNumber, uploadAadhar, pancardNumber, uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`Agent updated with id:${id}`) 
       })
} 
const deleteOwner=(request,response)=>{
    const id=parseInt(request.params.id)
    pool.query('DELETE FROM agent  WHERE id=$1',[id],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  Agent with id:${id}`)
    })
}
const deleteBooking = (request, response) => {
    const { id } = request.params;
  
    // Retrieve the booking details to get the truck data
    pool.query('SELECT * FROM booking WHERE id = $1', [id], (error, bookingSelectResult) => {
      if (error) {
        throw error;
      }
  
      const bookingData = bookingSelectResult.rows[0];
  
      if (bookingData) {
        // Delete the canceled booking
        pool.query('UPDATE booking SET status = $1 WHERE id = $2', ['canceled', id], (error, bookingDeleteResult) => {
          if (error) {
            throw error;
          }
  
          // Now, move data from the 'post' table to the 'post1' table based on some criteria (e.g., truckNumber)
          pool.query(
            'INSERT INTO post1 SELECT * FROM post WHERE "truckNumber" = $1',
            [bookingData.truckNumber],
            (error, post1InsertResult) => {
              if (error) {
                throw error;
              }
  
              response.status(200).send(`Canceled booking with ID ${id}, truck data moved to post1.`);
            }
          ); 
        });
      } else {
        response.status(404).send('Booking data not found for cancellation.');
      }
    });
  };
  const getBookDate=(request,response)=>{
    const {from , to} = request.query;
    console.log(`Fetching data for date range: from ${from} to ${to}`); // Add a log statement to check query parameters

    pool.query('select "truckNumber", date, "time", "from", "to","fromSublocation","toSublocation","totalPrice" from booking where  "date"::date >= $1::date AND "date"::date <= $2::date',[from,to],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)

    })
}
module.exports = {
  getAgentType,
  getInfo,
    getTrucks,
    getAgentInfo1,
    authenticateUser,
    getAgentInfo,
    getOwner,
    getAgent,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    deleteBooking,
    getBookDate,
}  
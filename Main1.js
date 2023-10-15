const express = require('express')
const pg = require('pg')
const bodyParser = require('body-parser')
const app = express()

const cors = require('cors')
const db = require('./login1')
const db5=require('./truck')
const db6=require('./post')

const db4=require('./Agent')
const port = 9000
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true, 
    })
) 

  // Increase maximum header size
  app.set('maxHeaderSize', 655369); 
  async function getitems(){
    const client = new pg.Client({
        host: 'localhost',
        port: 5432,
        database: 'login',
        user: 'postgres',
        password: 'Abhi@2001',
      })
      await client.connect()
 
     let res = await client.query('select * from main')
      console.log(res);
      await client.end()
      return res.rows 


    }
    app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
      
        next();
      });
      


app.get("/",cors(),async (req,res)=>{
    const data = await getitems()
    console.log("all the details");
     res.send(data)

})
app.get("/api/:option", (req, res) => {
  const option = req.params.option;
  const { from, to } = req.query;

  let query = "";

  if (option === "searchByDateForm") {
    query = `
      SELECT * FROM post
      WHERE from >= $1 AND to <= $2
    `;
  }
  
  const values = [from, to];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

const getPost=(request,response)=>{
    pool.query('select * from post ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}


app.get('/users', db.getUsers)
app.post('/auth',db.authenticateUser)
app.get('/users/:id', db.getUserById)  
app.post('/users/', db.createUser)
app.put('/users/:id', db.updateUser) 
app.delete('/users/:id', db.deleteUser)  
app.get('/AgentInfo', db4.getAgentInfo)
app.get('/AgentInfo1', db4.getAgentInfo1)
app.get('/AgentFetch', db4.getAgent)

app.post('/Agentauth', db4.authenticateUser)
app.get('/Trucks', db4.getTrucks)
app.get('/Info', db4.getInfo)
app.get('/sublocations', db5.getSubLocations)
app.post('/addsublocations', db5.createSublocations)
app.get('/sub', db5.getSub)

app.delete('/deletesublocations', db5.deleteSubLocations)
app.get('./sublocations/:id',db5.getSubLocationsById)
app.get('/agentType', db4.getAgentType)

app.get('/Agent', db4.getOwner)
app.get('/Agent/:id', db4.getOwnerById)
app.post('/Agent/', db4.createOwner) 

app.put('/Agent/:id', db4.updateOwner) 
app.delete('/Agent/:id', db4.deleteOwner)
app.get('/PostDate', db6.getPostDate)
app.get('/PostTruck', db6.getPostTruck)
app.get('/location', db6.getLocation)
app.get('/Bookings', db4.getBookDate)

app.get('/Post', db6.getPost)
app.get('/Post/:id', db6.getPostById)
app.get('/Posting/:id', db6.getPostByTruck)

app.post('/Post/', db6.createPost) 
app.post('/Post1/', db6.createPost1) 

app.put('/Post/:id', db6.updatePost) 
app.delete('/Post/:id', db6.deletePost)
app.delete('/Post1/:id', db6.deletePost1)

app.get('/TruckPost/:truckNumber',db6.setPost)
app.get('/truckNumber', db5.getTruckNumber)
app.get('/truckNumber1', db5.getTruckNumber1)

app.get('/book', db5.getBook)
app.get('/book/:id', db5.getBookById)
app.post('/book', db5.createBook)
app.delete('/deltruck/:truckNumber', db5.delTruck)
app.get('/booking/:crn', db5.getBooking)
app.put('/booking/:id', db4.deleteBooking)

app.get('/truck', db5.getTruck)
app.get('/truck/:id', db5.getTruckById)
app.post('/truck/', db5.createTruck) 

app.put('/truck/:id', db5.updateTruck) 
app.delete('/truck/:id', db5.deleteTruck)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})   

module.exports= app;
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
//   const getAgentInfo=(request,response)=>{
//     pool.query('select "agentType" from agent ',(error,results)=>{
//         if(error){
//             throw error
//         } 
//         const agentTypes = results.rows.map((row) => row.agentType);
      

// response.json(agentTypes);
//     })
// }
 
const getPostDate=(request,response)=>{
    const {from , to} = request.query;
    console.log(`Fetching data for date range: from ${from} to ${to}`); // Add a log statement to check query parameters

    pool.query('select "truckNumber", date, "time", "from", "to" from post where  "date"::date >= $1::date AND "date"::date <= $2::date',[from,to],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)

    })
}
const getPostTruck=(request,response)=>{
    const { truckNumber,crn } = request.query;
    console.log(`Fetching data for date range: ${truckNumber}`); // Add a log statement to check query parameters

    pool.query('select "truckNumber", date, name, "from", "to",status from booking where  "truckNumber"=$1 and crn=$2',[truckNumber,crn],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)

    })
}
const getLocation=(request,response)=>{
    const { loadingSublocations,unloadingSublocations } = request.query;
    console.log(`Fetching data for date range: ${loadingSublocations} to ${unloadingSublocations}`); // Add a log statement to check query parameters

    pool.query('select "loadingSublocations","unloadingSublocations" from post ',(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)

    })
}
const getPost=(request,response)=>{
    const { crn }= request.query
    console.log(crn)
    pool.query('select * from post where crn=$1 ',[crn],(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
} 
const getPostById=(request,respose)=>{
    const id = parseInt(request.params.id)
    pool.query('select * from post where id=$1',[id],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const getPostByTruck=(request,respose)=>{
    const truckNumber = parseInt(request.params.id)
    pool.query('select * from post where "truckNumber"=$1',[truckNumber],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const createPost=(request,response)=>{
   const {  
    truckNumber,
   date,
   from,
   time,
   to,
   loadingSublocations,
   unloadingSublocations,
   crn,
   
   }=request.body
   pool.query('insert into post ("truckNumber", date, "time", "from", "to", "loadingSublocations","unloadingSublocations", crn ) values($1,$2,$3,$4,$5,$6,$7,$8)',[ truckNumber,  date, time,from, to,loadingSublocations,unloadingSublocations,crn],(error,results)=>{
    if(error){
        throw error
    }
    response.status(200).send(`post truck add with id:${results.insertid}`)
   })
}
const createPost1=(request,response)=>{
    const {  
     truckNumber,
    date,
    from,
    time,
    to,
    loadingSublocations,
    unloadingSublocations,
    crn,
    
    }=request.body
    pool.query('insert into post1 ("truckNumber", date, "time", "from", "to", "loadingSublocations","unloadingSublocations", crn ) values($1,$2,$3,$4,$5,$6,$7,$8)',[ truckNumber,  date, time,from, to,loadingSublocations,unloadingSublocations,crn],(error,results)=>{
     if(error){
         throw error
     }
     response.status(200).send(`post truck add with id:${results.insertid}`)
    })
 }
const updatePost=(request,response)=>{
    const id=parseInt(request.params.id)
    const{ 
        registrationNumber,
        date,
        from,
        time,
        to,
        loadingSublocations,
        unloadingSublocations,
                    crn,
    }=request.body
    pool.query('update post set "registrationNumber"=$2, date=$3, "time"=$4, "from"=$5, "to"=$6, sublocations=$7, crn=$8,"loadingSublocations"=$9,"unloadingSublocations"=$10 where id=$1',[ registrationNumber,  date, time, from,to,crn,loadingSublocations,unloadingSublocations],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`truck updated with id:${id}`) 
       })
} 
const deletePost = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM post WHERE id=$1', [id], (error, results) => {
      if (error) {
        console.error("Error deleting from post table:", error);
        response.status(500).json({ error: "Internal server error" });
        return;
      }
      response.status(200).send(`Deleted truck with id: ${id} from post table.`);
    });
  };
  
  const deletePost1 = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM post1 WHERE id=$1', [id], (error, results) => {
      if (error) {
        console.error("Error deleting from post1 table:", error);
        response.status(500).json({ error: "Internal server error" });
        return;
      }
      response.status(200).send(`Deleted truck with id: ${id} from post1 table.`);
    });
  };
const setPost=(request,response)=>{
    const truckNumber=parseInt(request.params.id)
    pool.query('select "truckNumber" FROM post  WHERE "truckNumber"=$1',[truckNumber],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  truck with id:${id}`)
    })
}
function requireAuth(req, res, next) {
    if (!req.session.crn) {
      // User is not authenticated, redirect to the login page or send an unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // User is authenticated, continue to the next middleware or route handler
    next();
  }
  
  // Example protected route using the requireAuth middleware
  app.get('/protected-route', requireAuth, (req, res) => {
    // This route is protected and can only be accessed by authenticated users
    res.json({ message: 'This is a protected route.' });
  });
module.exports = {
    getLocation,
    getPostTruck,
    getPostDate,
    getPost,
    setPost,
    getPostById,
    createPost,
    createPost1,
    updatePost,
    deletePost1,
    deletePost,
    getPostByTruck,
}  
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
  
 
  const getTruckNumber=(request,response)=>{
    const { crn } = request.query;
    console.log('crn',crn)
    pool.query('select "truckNumber" from truck WHERE crn = $1',[crn],(error,results)=>{
        if(error){
            throw error
        } 
        const truckNumbers = results.rows.map((row) => row.truckNumber);
        console.log(truckNumbers)
response.json(truckNumbers);
    })
}
const getTruckNumber1=(request,response)=>{
    const { crn } = request.query;

  pool.query(
    'select * from booking WHERE crn = $1',
    [crn],
    (error, results) => {
      if (error) {
        throw error;
      }

      const truckData = results.rows.map((row) => ({
        truckNumber: row.truckNumber,
        truckName: row.truckName,
        date: row.date,
        from: row.from,
        to: row.to,
        status: row.status || "No Booking",
      }));
      response.json(truckData);
    }
  );
}
const getTruck=(request,response)=>{
    pool.query('select * from truck ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}
const getSubLocations=(request,response)=>{
    pool.query('select * from sub ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}
const getSub=(request,response)=>{
    const { loadingSublocations, unloadingSublocations } = request.query;
    pool.query(' SELECT distance FROM sub WHERE "loadingSublocations" = $1  AND "unloadingSublocations" = $2 ',[loadingSublocations,unloadingSublocations],(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}
const getSubLocationsById=(request,respose)=>{
    const id = parseInt(request.params.id)
    pool.query('select * from sub where id=$1',[id],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const createSublocations=(request,response)=>{
    const {
        loadingSublocations,
        unloadingSublocations,
        distance,
    }=request.body
    pool.query('insert into sub ("loadingSublocations" ,"unloadingSublocations",distance) values($1,$2,$3)',[loadingSublocations,unloadingSublocations,distance],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`sublocations add with id:${results.insertid}`)
    })
}
const deleteSubLocations=(request,response)=>{
    const id=parseInt(request.params.id)
    pool.query('DELETE FROM sublocations  WHERE id=$1',[id],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  sublocation with id:${id}`)
    })
}
const getTruckById=(request,respose)=>{
    const id = parseInt(request.params.id)
    pool.query('select * from truck where id=$1',[id],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const createTruck=(request,response)=>{
   const {  
    truckNumber,
            uploadRegistration,
            truckMaxWeight,
            truckWheels,
            truckFrontSideWithNumberPlate,
            truckBackSideWithNumberPlate,
            truckCabin,
            truckOdometer,
            truckVideo,
            truckPermit,
            truckFit,
            truckPollutionCertificate,
            truckInsuranceCertificate,
            truckOwnerPassportSizePhoto,
            truckDriverLicenseFrontSide,
            truckDriverLicenseBackSide,
            TruckDriverPoliceVerificationCertificate,
            crn,
   
   }=request.body
   pool.query('insert into truck ( "truckNumber", "uploadRegistration", "truckMaxWeight", "truckWheels", "truckFrontSideWithNumberPlate", "truckBackSideWithNumberPlate", "truckCabin", "truckOdometer", "truckVideo", "truckPermit", "truckFit", "truckPollutionCertificate", "truckInsuranceCertificate", "truckOwnerPassportSizePhoto", "truckDriverLicenseFrontSide", "truckDriverLicenseBackSide", "TruckDriverPoliceVerificationCertificate", crn) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',[ truckNumber,uploadRegistration,truckMaxWeight,truckWheels,truckFrontSideWithNumberPlate,truckBackSideWithNumberPlate,truckCabin,truckOdometer,truckVideo,truckPermit,truckFit,truckPollutionCertificate,truckInsuranceCertificate,truckOwnerPassportSizePhoto,truckDriverLicenseFrontSide,truckDriverLicenseBackSide, TruckDriverPoliceVerificationCertificate,crn],(error,results)=>{
    if(error){
        throw error
    }
    response.status(200).send(`truck add with id:${results.insertid}`)
   })
}
const getBook=(request,response)=>{
    pool.query('select * from booking ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}
const getBookById=(request,respose)=>{
    const id = parseInt(request.params.id)
    pool.query('select * from booking where id=$1',[id],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const createBook=(request,response)=>{
    const {  
        truckNumber,
   truckWheels,
   fromSublocation,
   toSublocation,
   crn,
   date,
   from,
   time,
   to,
   fromPincode,
   toPincode,
   totalKilometers,
   totalPrice,
   name, 
   phonenumber,
   fromAddress,
   toAddress,
truckMaxWeight,
 type,

    }=request.body
    pool.query('insert into booking ( "truckNumber", "truckWheels", "fromSublocation", "toSublocation", crn, date, "from", "time", "to", "fromPincode", "toPincode", "totalKilometers", "totalPrice", name, "fromAddress", "toAddress","truckMaxWeight",phonenumber,type) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)',[truckNumber,truckWheels, fromSublocation, toSublocation,crn,date,from,time,to,fromPincode,toPincode,totalKilometers,totalPrice,name,fromAddress,toAddress,truckMaxWeight,phonenumber,type],(error,results)=>{
     if(error){
         throw error
     }
     response.status(200).send(`truck add with id:${results.insertid}`)
    })
 }
 const delTruck=(request,response)=>{
    const truckNumber = request.params.truckNumber; 
    pool.query('DELETE FROM post1  WHERE "truckNumber"=$1',[truckNumber],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  truck with trucknumber:${truckNumber}`)
    })
}
const updateTruck=(request,response)=>{
    const id=parseInt(request.params.id)
    const{ 
        truckNumber,
            uploadRegistration,
            truckMaxWeight,
            truckWheels,
            truckFrontSideWithNumberPlate,
            truckBackSideWithNumberPlate,
            truckCabin,
            truckOdometer,
            truckVideo,
            truckPermit,
            truckFit,
            truckPollutionCertificate,
            truckInsuranceCertificate,
            truckOwnerPassportSizePhoto,
            truckDriverLicenseFrontSide,
            truckDriverLicenseBackSide,
            TruckDriverPoliceVerificationCertificate,
            crn,
    }=request.body
    pool.query('update truck set "truckNumber"=$2, "uploadRegistration"=$3, "truckMaxWeight"=$4, "truckWheels"=$5, "truckFrontSideWithNumberPlate"=$6, "truckBackSideWithNumberPlate"=$7, "truckCabin"=$8, "truckOdometer"=$9, "truckVideo"=$10, "truckPermit"=$11, "truckFit"=$12, "truckPollutionCertificate"=$13, "truckInsuranceCertificate"=$14, "truckOwnerPassportSizePhoto"=$15, "truckDriverLicenseFrontSide"=$16, "truckDriverLicenseBackSide"=$17, "TruckDriverPoliceVerificationCertificate"=$18, crn=$19 where id=$1',[truckNumber,uploadRegistration,truckMaxWeight,truckWheels,truckFrontSideWithNumberPlate,truckBackSideWithNumberPlate,truckCabin,truckOdometer,truckVideo,truckPermit,truckFit,truckPollutionCertificate,truckInsuranceCertificate,truckOwnerPassportSizePhoto,truckDriverLicenseFrontSide,truckDriverLicenseBackSide, TruckDriverPoliceVerificationCertificate,crn],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`truck updated with id:${id}`) 
       })
} 
const deleteTruck=(request,response)=>{
    const id=parseInt(request.params.id)
    pool.query('DELETE FROM truck  WHERE id=$1',[id],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  truck with id:${id}`)
    })
}
// const deleteBooking=(request,response)=>{
//     const id=parseInt(request.params.id)
//     pool.query('DELETE FROM booking  WHERE id=$1',[id],(error,results)=>
//     {
//         if(error){  
//             throw error
//         }
//         response.status(200).send(` deleted  truck with id:${id}`)
//     })
// }
const getBooking =(request,response)=>{
    const { crn } = request.params; 
    console.log(crn)
pool.query(`select id, "truckNumber",date,"time","from","to","totalPrice",status,name, "fromSublocation","toSublocation", "fromPincode", "toPincode", "totalKilometers","toAddress", "fromAddress", "truckMaxWeight",phonenumber,type from booking WHERE crn = $1 `,[crn],(error,results)=>{
    if(error){
        throw error;
    }
response.status(200).json(results.rows)
console.log(results.rows)
})
}


module.exports = {
    getBookById,
    createSublocations,
    createBook,
    getSub,
    getBooking,
    deleteSubLocations,
    getSubLocationsById,
    getSubLocations,
    getTruckNumber,
    getTruck,
    getBook,
    delTruck,
    getTruckById,
    createTruck,
    updateTruck,
    getTruckNumber1,
    // deleteBooking,
    deleteTruck,
}  
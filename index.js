// using express, create server

// import express
const express = require('express')


// import data.service
const dataService = require('./services/data.service')

// import cors
const cors = require('cors')

// import jwt
const jwt =require('jsonwebtoken')

// create a server app using express
const app=express()

// using cors  define origin to server app
app.use(cors({
    origin:['http://localhost:4200']
}))


// to parse json data
app.use(express.json())



// set a port for server app
app.listen(3000,()=>{
    console.log('Server started at port 3000');
})

// http request -REST API
app.get('/',(req,res)=>{
    res . send("GET METHOD")
})

app.post('/', (req,res)=>{
      res.send("Post Method")
})

app.patch('/', (req,res)=>{
    res.send("patch Method")
})

app.put('/', (req,res)=>{
    res.send("put Method")
})

app.delete('/', (req,res)=>{
    res.send("delete Method")
})


// Application Specific middleware
const appmiddle=(req,res,next)=>{
    console.log('This is Application Specific middleware');
    next()
}
app.use(appmiddle)


// router specific middleware
const jwtMiddle=(req,res,next)=>{
    console.log('inside router specific middleware');
    let token=req.headers['x-token']
    try{
        let data =jwt.verify(token,'supersecretkey123')
        console.log(data);
        
        req.currentAcno = data.currentAcno
        next()

    }
    catch{
        res.status(404).json({
            status:false,
            message:"Token Authentication Failed....... Please Login......"
        })
    }
}


// http request bank API

// 1.Login request
app.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);
    // Asynchronous call
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})



// 2.Register Request
app.post('/register',(req,res)=>{
    console.log('inside register function');
    console.log(req.body);
    // Asynchronous call
    dataService.register(req.body.acno,req.body.pswd,req.body.usrname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})




// 2.Deposit Request
app.post('/deposit',jwtMiddle,(req,res)=>{
    console.log('inside deposit function');
    console.log(req.body);
    // Asynchronous call
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})



// 2.Withdraw Request
app.post('/withdraw',jwtMiddle,(req,res)=>{
    console.log('inside withdraw function');
    console.log(req.body);
    // Asynchronous call
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})


// balance enquiry
app.post('/getbalance',jwtMiddle,(req,res)=>{
    console.log('inside Balance function');
    console.log(req.body);
    // Asynchronous call
    dataService.getbalance(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})

// get transaction

app.post('/getTransaction',jwtMiddle,(req,res)=>{
    console.log('inside Balance function');
    console.log(req.body);
    // Asynchronous call
    dataService.getTransaction(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})



//delete acno  acno: the same variable passed in client as parameter

app.delete('/deleteAcno/:acno',jwtMiddle,(req,res)=>{
    console.log('inside deleteAccount function');
    // Asynchronous call
    dataService.deleteAcno(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})
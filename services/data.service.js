// import account model from db.js

const db = require('./db')
const jwt = require('jsonwebtoken')


// login function
const login = (acno, pswd) => {
    // check acno and pswd present in mongo db
    // Asynchronous function  - using promise and then keyword
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {
            // acno and password is present in db
            console.log("Login Successfull");

            // current acno
            let currentAcno = acno

            // generate token
            const token = jwt.sign({
                currentAcno: acno
            }, 'supersecretkey123')

            return {
                status: true,
                message: 'Login Successfull',
                username: result.username,
                statusCode: 200,
                token,
                currentAcno

            }
        }
        else {
            console.log("Invalid Account /Password");
            return {


                status: false,
                message: 'Invalid Account /Password',
                statusCode: 404
            }
        }
    })
}

// register function

const register = (acno, pswd, usrname) => {
    console.log("inside register function definition");
    // check acno and pswd present in mongo db
    // Asynchronous function  - using promise and then keyword
    return db.Account.findOne({
        acno
    }).then((result) => {
        if (result) {
            // acno  is present in db
            console.log("Already Registered");
            return {
                status: false,
                message: 'Already Registered',
                statusCode: 404
            }
        }
        else {
            console.log("Register Successful");

            let newAccount = new db.Account({
                acno,
                password: pswd,
                username: usrname,
                balance: 0,
                transaction: []
            })

            newAccount.save()
            return {
                status: true,
                message: 'Registration Successfull',
                statusCode: 200
            }

        }
    })
}



// deposit
const deposit = (req, acno, pswd, amount) => {
    console.log("inside deposit function definition");
    // convert string amount to number
    let amt = Number(amount)
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        console.log(result);
        if (result) {

            if (req.currentAcno != acno) {

                return {

                    status: false,
                    message: 'Operation Denied....Allow only own account transaction',
                    statusCode: 404
                }
            }
            // acno and password is present in db

            result.balance += amt
            result.transaction.push({
                type: "Credit",
                amount: amt
            })
            result.save()
            return {
                acno: acno,
                status: true,
                message: `${amount} Deposited Successfull`,
                statusCode: 200
            }
        }
        else {
            console.log("Invalid Account /Password");
            return {
                acno: acno,
                status: false,
                message: 'Invalid Account /Password',
                statusCode: 404
            }
        }
    })

}



// withdraw
const withdraw = (req, acno, pswd, amount) => {
    console.log("inside withdraw function definition");
    // convert string amount to number
    let amt = Number(amount)
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        console.log(result);
        if (result) {

            if (req.currentAcno != acno) {

                return {

                    status: false,
                    message: 'Operation Denied....Allow only own account transaction',
                    statusCode: 404
                }
            }


            // Insufficient Balance
            if (result.balance < amt) {
                return {

                    status: false,
                    message: 'Transaction failed... Insufficient balance',
                    statusCode: 404
                }
            }

            // acno and password is present in db and sufficient balance

            result.balance -= amt
            result.transaction.push({
                type: "Debit",
                amount: amt
            })
            result.save()
            return {
                acno: acno,
                status: true,
                message: `${amount} Debited Successfull`,
                statusCode: 200
            }
        }
        else {
            console.log("Invalid Account /Password");
            return {
                acno: acno,
                status: false,
                message: 'Invalid Account /Password',
                statusCode: 404
            }
        }
    })

}


// get balance

const getbalance = (acno) => {
    // Asynchronous function  - using promise and then keyword
    return db.Account.findOne({
        acno
    }).then((result) =>{
        if(result){
        // acno present in mongo db
        let balance=result.balance
        result.transaction.push({
            type:"Balance enquiry",
            amount:"NIL"
        })
        result.save()
        // sent to client
        return{
            status:true,
            statusCode: 200,
            message:`Your Current Balance is: ${balance}`
        }
    }
    else{
        return{
            status:false,
            statusCode: 404,
            message:`Invalid account number`
        }
    }

    })
}



// get transaction
const getTransaction =(acno)=>{

    return db.Account.findOne({
        acno
    }).then((result) =>{
        if(result){
        // acno present in mongo db
        
        
        // sent to client
        return{
            status:true,
            statusCode: 200,
            transaction:result.transaction
        }
    }
    else{
        return{
            status:false,
            statusCode: 404,
            message:`Invalid Account Number`
        }
    }

    })
}


// deleteAccount
const deleteAcno =(acno)=>{
    return db.Account.deleteOne({
        acno
    }).then((result) =>{
        if(result){
        // acno present in mongo db
        // sent to client
        return{
            status:true,
            statusCode: 200,
            message:`Account Deleted Successfully`
        }
    }
    else{
        return{
            status:false,
            statusCode: 404,
            message:`Invalid Account Number`
        }
    }

    })

}



module.exports = {
    login,
    register,
    deposit,
    withdraw,
    getbalance,
    getTransaction,
    deleteAcno

}
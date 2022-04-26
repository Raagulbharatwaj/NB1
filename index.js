const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const User = require('./models/user')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_secret = "hdcbchbvhdsbvbkhdnkxncsncs.scidnc.hcbhkdb"

mongoose.connect('mongodb+srv://raagul:1003@cluster0.tzcmf.mongodb.net/NeuraBank?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const app = express()
app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

app.post('/api/change-password',async (req,res)=>
                                    {
                                        const {token,newPassword} = req.body
                                        try
                                        {
                                            const user = jwt.verify(token,JWT_secret)
                                            const _id = user.id;
                                            const hashedpassword = await bcrypt.hash(newPassword,10)
                                            await User.updateOne(
                                                                    {_id},
                                                                    {
                                                                        $set :{password:hashedpassword}
                                                                    }
                                                                
                                                                )
                                        }catch(err)
                                            {
                                                return res.json({status:"error",error:"Status 500 Internel server Error:Invalid Signature Received"})
                                            }
                                        
                                    })

app.post('/api/Home',async (req,res)=>
                                    {
                                        const {token} = req.body
                                        try
                                        {
                                            const user = jwt.verify(token,JWT_secret)
                                            const _id = user.id;
                                            return res.json({status:"ok",data:_id})
                                        }catch(err)
                                            {
                                                return res.json({status:"error",error:"Status 500 Internel server Error:Invalid Signature Received"})
                                            }
                                        
                                    })
app.post('/api/approval',async (req,res)=>
                                    {
                                        const {token} = req.body
                                        try
                                        {
                                            const user = jwt.verify(token,JWT_secret)
                                            const _id = user.id;
                                            return res.json({status:"ok",data:_id})
                                        }catch(err)
                                            {
                                                return res.json({status:"error",error:"Status 500 Internel server Error:Invalid Signature Received"})
                                            }
                                        
                                    })
app.post('/api/login',async (req,res)=>
                            {
                                const {accno,password} = req.body;
                                const user = await User.findOne({"accno":accno})
                                if(!user)
                                {
                                    return res.json({status:"error",error:"Invalid Username or Password"})
                                }
                                if(await bcrypt.compare(password,user.password))
                                {
                                    const token = jwt.sign({
                                                            id:user._id,
                                                            username:user.accno
                                                            },
                                                            JWT_secret
                                                          )
                                    return res.json({status:"ok",data:token})
                                }
                                return res.json({status:"error",error:"Invalid Username or Password"})
                            })

app.post('/api/register',async (req, res)=>
                            {
                                console.log(req.body)
                                const {accno,password:plainTextPassword} = req.body
                                if(!accno || typeof accno!=='string')
                                {
                                    return res.json({status:"error",error:"Invalid Account Number"})
                                }
                                if(accno.length!==10)
                                {
                                    return res.json({status:"error",error:"Account Number Should be 10 digit"})
                                }
                                if(!plainTextPassword || typeof plainTextPassword!=='string')
                                {
                                    return res.json({status:"error",error:"Invalid Password"})
                                }
                                if(plainTextPassword.length<=5)
                                {
                                    return res.json({status:"error",error:"Password Too small"})
                                }
                                const password = await bcrypt.hash(plainTextPassword,10)
                                try 
                                {
                                    const response = await User.create({accno,password})
                                    console.log(response)
                                    return res.json({status:'ok'})
                                    
                                }catch(err)
                                    {
                                        if(err.code==11000)
                                        {
                                            
                                            return res.json({status:"error",error:"Account No already Exists"})
                                        }
                                        console.log(err.message)
                                        throw err;
                                    }
                                
                            })

app.listen(3000,()=>
                {
                    console.log("Server started and running on port 3000");
                })          
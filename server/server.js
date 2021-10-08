const express=require('express');
const mysql = require('mysql');
const cors=require('cors');
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')
//const { Leth, Web3, Gateway} = require('lightstreams-js-sdk')

const app=express();
app.use(express.json())
app.use(cors())

var orbitDB
var ageT
const dbName = 'testDB'

const initIPFSInstance = async () => {
    return await IPFS.create({ repo: "./path-for-js-ipfs-repo" });
  };


async function initOrbit(){
    
    
    //const ipfs = await IPFS.create(ipfsOptions)  
        //const orbitdb = await OrbitDB.createInstance(ipfs);
      
        // Create / Open a database
        //const db = await orbitdb.keyvalue('test-db')
        //await db.load();
    
        //const db = orbitDB.keyvalue('test-db')
        //console.log(db.address.toString())
    
        //const identity = await Identities.createIdentity(options)
        //console.log(identity.toJSON())
    //const db = await OrbitDB.createInstance(ipfs)//,  { identity: identity })
    //await db.put({'_id': '1', first_name:'Siffre', last_name: 'Timmes', age: 18, gender: 'Male'})
    //orbitDB = db
    if(orbitDB == undefined){
        const ipfsOptions = {
            EXPERIMENTAL: {
              pubsub: true
            }
          }
        const ipfs = await IPFS.create(ipfsOptions)
        orbitDB = await OrbitDB.createInstance(ipfs)
        // some initial data
        var db = await orbitDB.docs(dbName)
        await db.load()
        console.log("db address:", db.address.toString())
    
        }
    else{
        db = await orbitDB.docs(dbName)
        await db.load()
        console.log("db address:", db.address.toString())
    }
        
        // Listen for updates from peers
        //db.events.on("replicated", address => {
        //  console.log(db.iterator({ limit: -1 }).collect());
        //});
      
        // Add an entry
        //const hash = await db.add("world");
        //console.log(hash);
      
        // Query
        //const result = db.iterator({ limit: -1 }).collect();
        //console.log(JSON.stringify(result, null, 2));
      //});
    
}

async function orbitAdd(value){
    //await initOrbit()
    
    const db = await orbitDB.docs('test-db')
    await db.load()
    console.log(db.address.toString())
    await db.put({'_id': value.id, fname: value.first_name, lname:value.last_name, age: value.age, gender:value.gender})/*, (err,res) =>{
    if(err){
        res.send({err: err})

    }
    else{
        res.json({message: "Data added"})

    }
})*/
    //console.log("hello")
    
    const address = db.address.toString()
    //console.log(address)
    await db.load()
    const result = db.get('')
        
    console.log(result)
    //res.send(value)
}

async function showDatabase(){
    await initOrbit()
    const db = await orbitDB.docs('test-db')
    await db.load()
    const result = await db.get('')
    //console.log(result)
    return result
}

async function query(age){
    //await initOrbit()
    const db = await orbitDB.docs('test-db')
    await db.load()
    const value = await db.query((doc) => doc.age >= age, (err,res) =>{
        if(err){
            res.send({err: err})
    
        }
        else{
            res.send({message: "Data added"})
    
        }
    })
    console.log(value)
    const test = Object.values(value)
    console.log(typeof(test))
    console.log(test)
    return test
    //res.send(value)
}

app.get('/showPatients', async (req, res)=>{
    //await initOrbit()
    console.log("Query the patients info")
    const result = await showDatabase()
    console.log(result)
    // res.send({users: result})
    res.json(result)
})


app.post('/orbitInit',async (req,res)=> {
    //initIPFS()
    await initOrbit()

    /*db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], 
    (err,result) => {console.log(err);}
    );*/
})


const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"LoginSystem"
})

app.post('/register', (req,res)=> {
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)
    //initIPFS()

    /*db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], 
    (err,result) => {console.log(err);}
    );*/
})

app.post('/orbitAdd', async (req,res)=> {
    await initOrbit()

    //console.log(req)

    //const id = req.body.id
    //const fname = req.body.first_name
    //const lname = req.body.last_name
    //const age = parseInt(req.body.age)
    //const gender = req.body.gender
    //console.log(id)
    //console.log(fname)
    //console.log(lname)
    //console.log(age)
    //console.log(typeof(age))
    //console.log(gender)
    values = req.body
    console.log(values.id)
    await orbitAdd(values)
    const result = await showDatabase()
    res.json(result)
    //res.send({message: "Data added"})

})

app.post('/ageQuery', async(req,res)=> {

    const age = parseInt(req.body.age)
    const temp = await query(age)
    ageT = temp
    console.log(temp)
    console.log(typeof(temp))
    //res.send(temp)

})

app.get('/QueryAge', async (req, res)=>{
    //await initOrbit()
    console.log("Query the patients info")
    const result = await query(ageT)
    console.log(result)
    // res.send({users: result})
    res.json(result)
})

const PORT=process.env.PORT || 5000;

app.listen(PORT, async()=>{
    console.log(`Server is running on ${PORT}` )
})


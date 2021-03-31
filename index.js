const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send("It's work");
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
const { MongoClient } = require("mongodb");
async function asyncCall () { 
    
    //to connect mongo serv : colection and bdd name = coupons
    const db = (await MongoClient.connect("mongodb://localhost:27017/coupons")).db();
    const coupons = db.collection("coupons");//bd+collection

    //add coupon ressource : JSON
    app.post('/coupons', async  (req, res) => {
        aggregate = await coupons.aggregate([ {$group:{ _id:null,max:{$max:"$_id"}}},{$project:{_id:0}}]).toArray();
        // console.log(aggregate);
        lastid = parseInt(aggregate[0].max)+1;
        req.body._id = lastid;
        if ("libelle" in req.body && "discount" in req.body && "deadline" in req.body){
            try{
                await coupons.insertOne(req.body);
                res.status(201).json(req.body); 
            }catch(error){
                console.log(error);
                res.status(400); 
            }
        }else{
            res.status(400).json("erreur: manque du contenu dans le JSON"); 
        }  
    })

    //find 1 coupon
    app.get('/coupons/:id', async  (req, res) => {
        id = parseInt(req.params.id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                try {
                    coupon = await coupons.findOne({"_id":id});
                    res.status(200).json(coupon);
                }catch(error){
                    console.log(error);
                    res.status(400);
                }
            }else{
                res.status(404).json("erreur l'id n'existe pas");
            }
        })
    })

    //find all coupons
    app.get('/coupons', async  (req, res) => {
        try {
            coupon = await coupons.find({}).toArray();
            res.status(200).json(coupon);
        }catch(error){
            console.log(error);
            res.status(400);
        }
    })

    //delete coupon
    app.delete('/coupons/:id', async (req, res) =>{
        id = parseInt(req.params.id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                try {
                    await coupons.deleteOne({"_id":id});
                    res.status(204).json();
                }catch(error){
                    console.log(error);
                    res.status(400);
                }
            }else{
                res.status(404).json("erreur l'id n'existe pas");
            }
        })
    })

    //modifie coupon
    app.patch('/coupons/:id', async (req, res) =>{
        id = parseInt(req.params.id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                // bodycontent = req.body;
                try{
                    await coupons.updateOne({"_id":id},{$set:req.body});
                    xxx = await coupons.findOne({"_id":id});
                    res.status(200).json(xxx);
                }
                catch(error){
                    console.log(error);
                    res.status(400);
                }
            }else{
                res.status(404).json("erreur l'id n'existe pas");
            }
        })
    })

    //function to test if id exist
    async function isExist(id){
        id = parseInt(id);
        const res = await coupons.findOne({"_id":id});
        if (res === null) {
            return false;}
        else{
            return true;
        }   
    }
}
asyncCall();
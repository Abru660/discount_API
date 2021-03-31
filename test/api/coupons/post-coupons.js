const { expect } = require('chai');
const request = require('superagent');
const { MongoClient } = require('mongodb');

const COUPONS_DATA = require('../../data/coupons');

describe('POST /coupons', function () {

    before(async () => {
        collections = {}
        const db = (await MongoClient.connect("mongodb://localhost:27017/coupons")).db();
        collections.coupons = db.collection('coupons');
        await collections.coupons.deleteMany();
    });
  
    beforeEach(async () => {
      await collections.coupons.insertMany([
        COUPONS_DATA[1],
        COUPONS_DATA[2],
        COUPONS_DATA[3]
      ]);
    });
  
    afterEach(async () => {
      await collections.coupons.deleteMany({});
    });
  
    it('should post a discount', async () => {
        insertedDiscount = {_id:4,deadline:"2021-09-22T15:00:00",discount: 30, libelle:"Réduction de 30%"}
        await collections.coupons.insertOne(insertedDiscount)
        await request.post('http://localhost:3000/coupons').send(insertedDiscount);
        const { body } = await request.get('http://localhost:3000/coupons/4');
        expect(body).to.be.deep.equal(insertedDiscount);
    });

    it('should return an 400 error (Data constraints not respected)', async () => {
      insertedDiscount = {_id:4}
      var {result} = Object
      try{
        const { response } = await request.post('http://localhost:3000/coupons').send(insertedDiscount);
        result = response
      }catch(err){
        expect("Bad Request").to.be.equal(err.message)
        expect(400).to.be.equal(err.status)
      }
      expect(result).to.be.undefined
    });

    it('should return a mongo error', async () => {
        insertedDiscount = {_id:1,deadline:"2021-09-22T15:00:00",discount: 30, libelle:"Réduction de 30%"}
        try{
          await request.post('http://localhost:3000/coupons').send(insertedDiscount);
        }catch(err){
          expect(11000).to.be.equal(err.code)
        }
        const { body } = await request.get('http://localhost:3000/coupons/1');
        expect(body).to.be.not.equal(insertedDiscount);

    });

  });
  
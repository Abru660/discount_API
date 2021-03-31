const { expect } = require('chai');
const request = require('superagent');
const { MongoClient } = require('mongodb');

const COUPONS_DATA = require('../../data/coupons');

describe('DELETE /coupons', function () {

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
  
    it('should delete a discount', async () => {
      const { body } = await request.get('http://localhost:3000/coupons/3');
      expected = {_id: 3, deadline: '2021-09-22T15:00:00', discount: 10, libelle: "Réduction novembre."}
      expect(expected).to.be.deep.equal(body);
      await request.delete('http://localhost:3000/coupons/3');
      try{
        await request.get('http://localhost:3000/coupons/3');
      }catch(err){
        expect("Not Found").to.be.equal(err.message)
        expect(404).to.be.equal(err.status)
      }
    });
  });
  
const { expect } = require('chai');
const request = require('superagent');
const { MongoClient } = require('mongodb');

const COUPONS_DATA = require('../../data/coupons');

describe('GET /coupons', function () {

    before(async () => {
        collections = {}
        try{
            const db = (await MongoClient.connect("mongodb://localhost:27017/coupons")).db();
            collections.coupons = db.collection('coupons');
        }catch(e){
            console.log(e)
        }
      
  
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
  
    it('should return a list of discounts', async () => {
      const { body } = await request.get('http://localhost:3000/coupons');
      const expectedCoupons = [COUPONS_DATA[1], COUPONS_DATA[2],COUPONS_DATA[3]].map((coupon) => {
        return {
          _id: coupon._id,
          deadline: coupon.deadline,
          discount: coupon.discount,
          libelle: coupon.libelle
        };
      });
      expect(body).to.be.deep.equal(expectedCoupons);
    });

    it('should return a specific discount', async () => {
      const { body } = await request.get('http://localhost:3000/coupons/1');
      const expectedCoupons = COUPONS_DATA[1];
      expect(body).to.be.deep.equal(expectedCoupons);
    });

    it('should return a 404 not found error', async () => {
      
      var { result } = Object;
      try{
        const { body } = await request.get('http://localhost:3000/coupons/0');
        result = body
      }catch(err){
        expect(404).equal(err.response.status);
        expect('Not Found').equal(err.message);
      }
      expect(result).to.be.undefined
    
    });
  });
  
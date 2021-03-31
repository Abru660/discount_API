const { expect } = require('chai');
const request = require('superagent');
const { MongoClient } = require('mongodb');

const COUPONS_DATA = require('../../data/coupons');

describe('PATCH /coupons', function () {

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
  
    it('should return a modified discount', async () => {
        await request.patch('http://localhost:3000/coupons/3').send({deadline: '2021-09-22T15:00:00', discount: 30, libelle: "Réduction modifié."});
        const expectedCoupon = {_id : 3,deadline: '2021-09-22T15:00:00', discount: 30, libelle: "Réduction modifié."}
        const {body} = await request.get('http://localhost:3000/coupons/3')
        expect(body).to.be.deep.equal(expectedCoupon);
    });

    it('should return a 404 not found error', async () => {
        var {result} = Object
        try{
            await request.patch('http://localhost:3000/coupons/0').send({deadline: '2021-09-22T15:00:00', discount: 30, libelle: "Réduction modifié."});
            result = request
        }catch(err){
            expect(404).to.be.equal(err.status);
            expect("Not Found").to.be.equal(err.message);
        }
            expect(result).to.be.undefined
        
    });

  });
  
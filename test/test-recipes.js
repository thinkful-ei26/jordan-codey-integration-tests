const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes', function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('Should show item/s on GET', function(){
        return chai
            .request(app)
            .get('/recipes')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["id", "name", "ingredients"];
                res.body.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
            })
    })
    it('Should create item on POST', function() {
        const newItem = { name: "coffee", ingredients: ["beans", "water", "supgar"] };
        return chai
            .request(app)
            .post("/recipes")
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "name", "ingredients");
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(
                Object.assign(newItem, { id: res.body.id })
                );
            });
    })
    it('Should update item on PUT', function() {
        const updateData = {
            name: "milkshake",
            ingredients: ["some stuff", "other stuff"]
          };
      
          return (
            chai
              .request(app)
              .get("/recipes")
              .then(function(res) {
                updateData.id = res.body[0].id;
                return chai
                  .request(app)
                  .put(`/recipes/${updateData.id}`)
                  .send(updateData);
              })

              .then(function(res) {
                expect(res).to.have.status(204);
              })
          );
        
    })
    it('Should delete item on DELETE', function() {
        return (
            chai
              .request(app)
              .get("/recipes")
              .then(function(res) {
                return chai.request(app).delete(`/recipes/${res.body[0].id}`);
              })
              .then(function(res) {
                expect(res).to.have.status(204);
              })
          );
    })
})

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

const should = chai.should();
const { expect } = chai;


chai.use(chaiHttp);

describe('/POST User', () => {
  it('should create a new user', () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '54321',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('token');
        res.body.should.have.property('message');
        res.body.message.should.equal('user added successfully');
      });
  });
  it('should catch empty name and phone number inputs and password with length less than 6 characters', () => {
    const user = {
      name: '',
      password: '',
      phoneNumber: '',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.length.should.equal(3);
        expect(res.body.errors).to.include.members([
          'name, phoneNumber, fields are required',
          'password should be 6 characters long or more',
        ]);
      });
  });
  it('should catch empty spaces in inputs', () => {
    const user = {
      name: '       ',
      password: '      ',
      phoneNumber: '     ',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.length.should.equal(3);
        expect(res.body.errors).to.include.members([
          'name, phoneNumber, fields are required',
          'password should be 6 characters long or more',
        ]);
      });
  });
  it('should catch phone numbers with length greater than 5', () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '123456',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.length.should.equal(1);
        expect(res.body.errors).to.include.members([
          'use a valid phone number with 5 digits',
        ]);
      });
  });
  it('should catch phone numbers with length less greater than 5', () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '1234',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.length.should.equal(1);
        expect(res.body.errors).to.include.members([
          'use a valid phone number with 5 digits',
        ]);
      });
  });
  it('should catch password with length less greater than 6', () => {
    const user = {
      name: 'user',
      password: '12345',
      phoneNumber: '12345',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.length.should.equal(1);
        expect(res.body.errors).to.include.members([
          'password should be 6 characters long or more',
        ]);
      });
  });
  it('should not register a user twice with the same email', () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '54321',
    };
    chai.request(app)
      .post('/api/v1/user')
      .send(user);

    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('errors');
        expect(res.body.errors).to.include.members([
          'phone number is already registered',
        ]);
      });
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

const should = chai.should();
const { expect, assert } = chai;

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
  it('should not register a user twice with the same phone number', () => {
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

describe('/POST Login', () => {
  before(() => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '12345',
    };

    chai.request(app)
      .post('/api/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
      });
  });
  it('should login a user successfully and return a token', () => {
    const user = {
      password: '123456',
      phoneNumber: '12345',
    };

    chai.request(app)
      .post('/api/v1/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token');
      });
  });
  it('should catch empty phoneNumber and password fields', () => {
    const user = {
      password: '',
      phoneNumber: '',
    };

    chai.request(app)
      .post('/api/v1/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.errors).to.include.members([
          'phoneNumber and password are required fields',
        ]);
      });
  });
  it('should catch non existent user', () => {
    const user = {
      password: '123456',
      phoneNumber: '09876',
    };

    chai.request(app)
      .post('/api/v1/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.errors).to.include.members([
          'phonenumber or password incorrect',
        ]);
      });
  });
  it('should catch wrong password', () => {
    const user = {
      password: '654321',
      phoneNumber: '12345',
    };

    chai.request(app)
      .post('/api/v1/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.errors).to.include.members([
          'phonenumber or password incorrect',
        ]);
      });
  });
});

describe('/DELETE User', () => {
  it('should delete a contact successfully', async () => {
    const user = {
      name: 'delete_user',
      password: '123456',
      phoneNumber: '11111',
    };
    const response = await chai.request(app)
      .post('/api/v1/user')
      .send(user);
    const { token } = response.body;

    chai.request(app)
      .delete('/api/v1/user')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.message.should.equal('contact deleted successfully');
      });
  });
  it('should not delete a contact if token isn\'t provided', () => {
    chai.request(app)
      .delete('/api/v1/user')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.errors).to.include.members([
          'please provide a valid token',
        ]);
      });
  });
  it('should not delete a contact if an invalid token is provided', () => {
    chai.request(app)
      .delete('/api/v1/user')
      .set('token', 'invalid token')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.errors).to.include.members([
          'please provide a valid token',
        ]);
      });
  });

  it('should return an error if the user doesn\'t exist', async () => {
    const user = {
      name: 'delete_user',
      password: '123456',
      phoneNumber: '11111',
    };
    const response = await chai.request(app)
      .post('/api/v1/user')
      .send(user);
    const { token } = response.body;

    chai.request(app)
      .delete('/api/v1/user')
      .set('token', token)
      .end();

    chai.request(app)
      .delete('/api/v1/user')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.errors).to.include.members([
          'authentication failed',
        ]);
      });
  });
});

describe('/GET User', () => {
  it('should return a list of all users successfully', async () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '22222',
    };
    const response = await chai.request(app)
      .post('/api/v1/user')
      .send(user);
    const { token } = response.body;

    chai.request(app)
      .get('/api/v1/user')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        expect(res.body.data).to.include.members(['22222']);
        assert.isAbove(res.body.data.length, 0);
      });
  });

  it('should return an error if a user doesn\'t add a token', () => {
    chai.request(app)
      .get('/api/v1/user')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.errors).to.include.members([
          'please provide a valid token',
        ]);
      });
  });

  it('should return an error if a user provides an invalid token', () => {
    chai.request(app)
      .get('/api/v1/user')
      .set('token', 'invalid token')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.errors).to.include.members([
          'please provide a valid token',
        ]);
      });
  });

  it('should return an error if the user doesn\'t exist', async () => {
    const user = {
      name: 'delete_user',
      password: '123456',
      phoneNumber: '11111',
    };
    const response = await chai.request(app)
      .post('/api/v1/user')
      .send(user);
    const { token } = response.body;

    chai.request(app)
      .delete('/api/v1/user')
      .set('token', token)
      .end();

    chai.request(app)
      .get('/api/v1/user')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.errors).to.include.members([
          'authentication failed',
        ]);
      });
  });
});

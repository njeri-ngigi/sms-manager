const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

const should = chai.should();
const { expect, assert } = chai;

chai.use(chaiHttp);

const verifyAuthentication = () => {
  // check if token is valid
};

describe('SMS', () => {
  let token = '';

  before(async () => {
    const user = {
      name: 'user',
      password: '123456',
      phoneNumber: '77777',
    };
    const response = await chai.request(app)
      .post('/api/v1/user')
      .send(user);
    ({ token } = response.body);

    const response2 = await chai.request(app)
      .post('/api/v1/user')
      .send({ ...user, phoneNumber: '99999' });

    const { token: token2 } = response2.body;

    chai.request(app)
      .post('/api/v1/sms')
      .set('token', token)
      .send({
        message: 'Hello',
        receiver: '99999',
      })
      .end((err, res) => {
        res.should.have.status(201);
      });

    chai.request(app)
      .post('/api/v1/sms')
      .set('token', token2)
      .send({
        message: 'Hello',
        receiver: '77777',
      })
      .end((err, res) => {
        res.should.have.status(201);
      });
  });

  describe('/POST sms', () => {
    const sms = {
      message: 'hey you',
      receiver: '99999',
    };

    it('should send an sms successfully', () => {
      chai.request(app)
        .post('/api/v1/sms')
        .set('token', token)
        .send(sms)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.message.should.equal('sms sent successfully');
        });
    });

    it('should catch empty fields', () => {
      chai.request(app)
        .post('/api/v1/sms')
        .set('token', token)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.include.members([
            'receiver and message fields are required',
          ]);
        });
    });

    it('should catch fields with empty spaces', () => {
      chai.request(app)
        .post('/api/v1/sms')
        .set('token', token)
        .send({
          message: '    ',
          receiver: '    ',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.include.members([
            'receiver and message fields are required',
          ]);
        });
    });

    it('should not send an sms to a non-existent receiver', () => {
      chai.request(app)
        .post('/api/v1/sms')
        .set('token', token)
        .send({
          message: 'hellow',
          receiver: '12121',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('errors');
          res.body.errors.should.include.members([
            'receiver doesn\'t exist',
          ]);
        });
    });

    it('should not send sms to self', () => {
      chai.request(app)
        .post('/api/v1/sms')
        .set('token', token)
        .send({
          message: 'hellow',
          receiver: '77777',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('You cannot send yourself a message');
        });
    });
  });

  describe('/GET sms/users', () => {
    it('return all user messages', () => {
      chai.request(app)
        .get('/api/v1/sms/users')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.have.property('sent');
          res.body.data.should.have.property('received');
          assert.isAbove(res.body.data.sent.length, 0);
          assert.isAbove(res.body.data.received.length, 0);
        });
    });
  });

  describe('/GET sms/users/sent', () => {
    it('return all user\'s sent messages', () => {
      chai.request(app)
        .get('/api/v1/sms/users/sent')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          assert.isAbove(res.body.data.length, 0);
        });
    });
  });

  describe('/GET sms/users/received', () => {
    it('return all user\'s received messages', () => {
      chai.request(app)
        .get('/api/v1/sms/users/received')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          assert.isAbove(res.body.data.length, 0);
        });
    });
  });
});

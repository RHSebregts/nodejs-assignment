const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server');
// Assertion Style
chai.should()
chai.use(chaiHttp)


// Server Test
describe('http server is running', ()=>{
    it('should return status OK', (done)=>{
        chai
        .request(server)
        .get('/')
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('should return 404', (done)=>{
        chai
        .request(server)
        .get('/asdfasdfasf')
        .end((err,res)=>{
            res.should.have.status(404)
        })
        done()
    })
}) 


// Post Route Entries Test
describe('Posting /findRouteEntries', ()=>{
    it('should not return any route documents for absurd values', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'gt', 100000000 ],
            odo: [ 'gt', 1000000000 ],
            speed: [ 'gt', 1000 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findRouteEntries/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('routeEntries').lengthOf(0)
            done()
        })
    })
    it('should return only route documents speed > 20', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'gt', 20 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findRouteEntries/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('routeEntries')
            res.body.routeEntries.forEach(entry =>{
                entry.should.have.property('speed').above(20)
            })
            done()
        })
    })
    it('should return only route documents speed < 20', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'lt', 20 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findRouteEntries/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('routeEntries')
            res.body.routeEntries.forEach(entry =>{
                entry.should.have.property('speed').below(20)
            })
            done()
        })
    })
    it('should return only route documents speed = 12', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ '==', 12 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findRouteEntries/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('routeEntries')
            res.body.routeEntries.forEach(entry =>{
                entry.should.have.property('speed').equals(12)
            })
            done()
        })
    })
})
// Post Incidents Test
describe('Posting /findIncidents', ()=>{
    it('should not return any incident documents for absurd values', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'gt', 100000000 ],
            odo: [ 'gt', 1000000000 ],
            speed: [ 'gt', 1000 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents').lengthOf(0)
            done()
        })
    })
    it('should return only incident documents speed > 20', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'gt', 20 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('speed').above(20)
            })
            done()
        })
    })
    it('should return only incident documents speed < 20', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'lt', 20 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('speed').below(20)
            })
            done()
        })
    })
    it('should return only incident documents speed = 12', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ '==', 12 ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('speed').equals(12)
            })
            done()
        })
    })
    it('should return only documents where time is empty', (done)=>{
        const postBody = {
            time: [ 'ignore', '', 'on' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'ignore', ''],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('time').equals('')
            })
            done()
        })
    })
    it('should return only documents where energy is empty', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '', 'on' ],
            odo: [ 'ignore', '' ],
            speed: [ 'ignore', '', 'on' ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('energy').equals('')
            })
            done()
        })
    })
    it('should return only documents where odo is empty', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '', 'on' ],
            speed: [ 'ignore', ''],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('odo').equals('')
            })
            done()
        })
    })
    it('should return only documents where speed is empty', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'ignore', '', 'on' ],
            soc: [ 'ignore', '' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('speed').equals('')
            })
            done()
        })
    })
    it('should return only documents where soc is empty', (done)=>{
        const postBody = {
            time: [ 'ignore', '2017-11-23T12:20' ],
            energy: [ 'ignore', '' ],
            odo: [ 'ignore', '' ],
            speed: [ 'ignore', ''],
            soc: [ 'ignore', '', 'on' ],
            type : 'api'
          }
        chai
        .request(server)
        .post('/findIncidents/')
        .send(postBody)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('incidents')
            res.body.incidents.forEach(entry =>{
                entry.should.have.property('soc').equals('')
            })
            done()
        })
    })
})
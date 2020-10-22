const getDb = require('../util/database').getDb;

class NodeDevice {
  constructor(id, name) {
    this.id = id;
    this.name = name;        
    sensor  
  }

  save(){
    const db = getDb();
    db.collection('nodeDevices')
    .insertOne(this)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    });
  }
}

module.exports = NodeDevice;
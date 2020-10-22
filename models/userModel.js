const getDb = require('../util/database').getDb;

class User {
    constructor(username, password) {
      this.username = username;
      this.password = password;        
    }

    save(){
      const db = getDb();
      db.collection('users')
      .insertOne(this)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      });
    }
}

module.exports = User;
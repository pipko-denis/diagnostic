//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
const {Pool} = require('pg')
const config = require('../config/config')



const pool = new Pool({    
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,    
    database: config.db.database,    
    application_name: 'Diagnostic_nrp',
    ssl: false,
    max: 5, // set pool max size to 20
    min: 1, // set min pool size to 4
    idleTimeoutMillis: 5000, // close idle clients after 1 second
    connectionTimeoutMillis: 10000, // return an error after 1 second if connection could not be established
  })

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    })
  })


module.exports = {
    pool : pool,
}


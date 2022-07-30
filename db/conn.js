const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('thoughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Conectado ao banco de dados!')
} catch (err) {
  console.log(`Não foi possível conectar ao banco de dados: ${err}`)
}

module.exports = sequelize

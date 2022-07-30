const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {
  ///////////////////////////////////////
  static login(req, res) {
    res.render('auth/login')
  }

  ///////////////////////////////////////
  static register(req, res) {
    res.render('auth/register')
  }

  ///////////////////////////////////////
  static async loginPost(req, res) {
    const { email, password } = req.body

    // procura usuário pelo email
    const user = await User.findOne({ where: { email: email } })

    // checa se o usuário foi encontrado
    if (!user) {
      req.flash('errmessage', 'Usuário não encontrado!')
      res.render('auth/login')

      return
    }

    // compara se a senha está correta
    const passwordMatch = bcrypt.compareSync(password, user.password)

    if (!passwordMatch) {
      req.flash('errmessage', 'Senha inválida!')
      res.render('auth/login')

      return
    }

    // logando usuário
    req.session.userid = user.id

    req.flash('message', 'Autenticação realizada com sucesso!')

    req.session.save(() => {
      res.redirect('/')
    })
  }

  ///////////////////////////////////////
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body

    // validação de senhas iguais
    if (password != confirmpassword) {
      req.flash('errmessage', 'As senhas não são iguais, tente novamente!')
      res.render('auth/register')

      return
    }

    // validar se o usuario existe
    const checkIfUserExists = await User.findOne({ where: { email: email } })

    if (checkIfUserExists) {
      req.flash('errmessage', 'O email já está em uso!')
      res.render('auth/register')

      return
    }

    // criar senha
    const salt = bcrypt.genSaltSync(12)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user)

      // inicializando a sessão logo após registro
      req.session.userid = createdUser.id

      req.flash('message', 'Cadastro realizado com sucesso!')

      req.session.save(() => {
        res.redirect('/')
      })
    } catch (err) {
      console.log(err)
    }
  }

  ///////////////////////////////////////
  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}

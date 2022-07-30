const PORT = process.env.PORT || 3000
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// models
const Thought = require('./models/Thought')
const User = require('./models/User')

// routes import
const thougtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// controllers
const ThoughtController = require('./controllers/ThoughtController')

// template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

// sessions
app.use(
  session({
    name: 'session',
    secret: 'meu_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      //expires: new Date(Date.now() + 3600000),
      httpOnly: true
    }
  })
)

// mensagens flash
app.use(flash())

// public path
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session
  }

  next()
})

// routes
app.use('/thoughts', thougtsRoutes)
app.use('/', authRoutes)
app.use('/', ThoughtController.showThoughts)

conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(PORT)
  })
  .catch(err => console.log(err))

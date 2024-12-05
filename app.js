const express = require('express');
const app = express();
const path = require('path'); // Tambahkan ini
const todoroutes = require('./routes/tododb.js');
require('dotenv').config();
const port = process.env.PORT;
const db = require('./database/db');
//const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
// Mengimpor middleware
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');


app.use(express.json());
app.use('/todos',todoroutes);
app.set('view engine', 'ejs');

//app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Gunakan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));


// Middleware untuk file statis
app.use(express.static(path.join(__dirname, 'public')));

// Atur view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', authRoutes);



app.get('/login', (req, res) => {
    console.log('Rendering login page with login-layouts');
    res.render('login', { layout:"layouts/login-layouts" });
});



app.get('/', isAuthenticated, (req, res) =>{
    res.render('index', {
        layout: 'layouts/main-layout'
    });
});



app.get('/contact', isAuthenticated, (req, res) =>{
    res.render('contact',  {
        layout: 'layouts/main-layout'
    });
});



app.get('/todo', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


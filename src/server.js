import express from 'express';
import path from 'path';
import axios from 'axios';
const app = express();
import checkLogin from './middleware/authCheck.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
import { dirname } from 'path';
import {createUser, usuarioExist} from './dao/UsuarioDao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000


// Configuração do motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',checkLogin, (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login',{error: null})
})

app.post('/login', async (req,res)=>{
    const {senha,email} = req.body;

    // const usuario = await usuarioExist(email,senha);

    const {data} = await axios.get(`http://localhost:8080/api/users/get-user-by-email/${email}`);
    console.log(data)

    if(data == null){
        return res.render("login",{error:"Usuário ou senha incorretos"});
    }

    if(data.password != senha){
        return res.render("login",{error:"Usuário ou senha incorretos"});
    }

    res.clearCookie('usuarioEmail');
    res.cookie('usuarioEmail', email, { maxAge: 900000, httpOnly: true }); // 15 minutos
    return res.redirect("/");
})

app.get('/cadastro',(req, res) => {
    res.render('cadastro')
})

app.post('/cadastrar-usuario', async (req,res)=>{
    const {name,password,email} = req.body;

    try {
        const response = await axios.post('http://localhost:8080/api/users', {
            name,
            email,
            password
        });

        if (response.status === 201 || response.status === 200) {
            return res.redirect("/login");
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        return res.render('cadastro', { error: 'Erro ao cadastrar usuário. Tente novamente.' });
    }
})

app.get('/cursos',checkLogin, (req, res) => {
    res.render('cursos')
})

app.get('/cadastro_cursos', checkLogin ,(req, res) => {
    res.render('cadastro_curso')
})

app.post('/cadastrar-curso', async (req,res)=>{
    console.log("Bati aqui", req.body);
    const {nome,senha,email} = req.body;

    const usuarioCriado = await createUser(email, nome, senha);

    if(usuarioCriado != null){
        return res.redirect("/");
    }
})

app.get('/detalhes-curso', checkLogin,(req, res) => {
    res.render('detalhes_curso')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
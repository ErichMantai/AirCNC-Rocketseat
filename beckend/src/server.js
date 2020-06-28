const express = require('express');
const routes = require("./routes");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');

const socket = require('socket.io');
const http = require('http');
const { connect } = require('http2');

const app = express();

const server = http.Server(app);
const io = socket(server);

mongoose.connect("mongodb+srv://mantai:leone123@cluster0-nkhhs.mongodb.net/aircnc?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const  connectUsers = {};

io.on('connection', socket =>{

    const { user_id } = socket.handshake.query; //caputura o usuário que conectou na aplicação pelo front end   
    connectUsers[ user_id ] = socket.id;    
});

app.use((req,res,next) => {
    req.io = io;
    req.connectUsers = connectUsers;

    return next(); //avança para o proximo metodo do servidor;  
});

app.use(cors());
app.use(express.json());
app.use('/files',express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes); 


server.listen(3333);


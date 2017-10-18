var     express = require('express'),
        helmet = require('helmet'),
        expressSession = require('express-session'),
        expressValidator = require('express-validator'),
        consign = require('consign'),
        bodyParser = require('body-parser');

var application = express();
application.use(helmet());

application.set('view engine', 'ejs');  //configura o motor de renderização
application.set('views', './app/views');//configura o diretório para uso do motor de renderização

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({extended: true}));

application.use(expressValidator());

application.use(express.static('./app/public'));//configura o diretório de arquivos estaticos

//configuração da sessão
application.use(expressSession(
        {
            secret: '24234t24tgwergGGSDFGQG23dasd',
            resave: false,
            saveUninitialized: false,
            cookie: {maxAge: 1000 * 60 * 60 * 5} //1 segundo(1000 milessegundos) * 60 (um minuto) * 60 (uma hora) * 5
        }
));

/*Collect and monitor custom metrics*/
var probe = require('pmx').probe();

var counter = 0;

var metric = probe.metric({
    name: 'Realtime user',
    value: function () {
        return counter;
    }
});

setInterval(function () {
    counter++;
}, 100);

consign()
        .include('/app/routes')
        .then('config/dbConnection.js')
        .then('app/models')
        .then('app/controllers')
        .into(application);

module.exports = application;

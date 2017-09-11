module.exports = (application) =>
{
    /*                API DE RESERVAS                                */
    application.get('/reservas', (request, response) =>
    {
        application.app.controllers.reservas.recuperarObjetos(application, request, response);
    });
    application.get('/administrar-reservas', (request, response) =>
    {
        application.app.controllers.reservas.administrar(application, request, response);
    });
    application.post('/cadastrar-reserva', (request, response) =>
    {
        application.app.controllers.reservas.inserir(application, request, response);
    });
    application.post('/atualizar-reserva', (request, response) =>
    {
        application.app.controllers.reservas.atualizar(application, request, response);
    });
};

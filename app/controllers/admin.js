module.exports.admin = (application, request, response) =>
{
    let dados =
    {
        usuario: 'Nome Usuário',
        tipoUsuario: 'administrador'
    };
    response.render('admin', {dados: dados});
};
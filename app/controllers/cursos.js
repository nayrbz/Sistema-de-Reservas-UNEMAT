/*              RECUPERAÇÃO DE DADOS DE CURSOS                                */
module.exports.recuperarObjetos = (application, request, response) =>
{
    let _aux = request.query.txconsulta === undefined ? '' : request.query.txconsulta;

    const adcionais =
            {
                ordem: request.query.order,
                limit: request.query.limit,
                offset: request.query.offset,
                txconsulta: '%' + _aux + '%'
            };

    const connection = application.config.dbConnection;
    let CursosDAO = new application.app.models.CursosDAO(connection);

    let callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro: ', error);
        } else
        {
            response.send(JSON.stringify(
                    {
                        total: results.rowCount,
                        rows: results.rows
                    }
            ));
        }
    };

    CursosDAO.buscaIntervalo(adcionais, callback);
};

/*              ADMINISTRAÇÃO DOS CURSOS                                */
module.exports.administrar = (application, request, response) =>
{
    response.render('admin/cursos');
};
/*               CADASTRO DE CURSOS                                */
module.exports.inserir = (application, request, response) =>
{
    let dados = request.body;
    const connection = application.config.dbConnection;
    let CursosDAO = new application.app.models.CursosDAO(connection);

    let callbackVerificacao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na verificação de curso: ', error);
        } else
        {
            if (results.rowCount === 0)
                CursosDAO.inserir([dados.descricao, dados.sigla, dados.ativo], callbackInsercao);
            else
                response.send({status: 'alert', title: 'Erro!', msg: 'Curso já existe no banco.'});
        }
    };

    let callbackInsercao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro no cadastro de curso: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Curso cadastrado com sucesso!'});
    };
    CursosDAO.busca(dados.descricao, callbackVerificacao);
};
/*              ATUALIZAÇÃO DE CURSOS                                */
module.exports.atualizar = (application, request, response) =>
{
    const dados = request.body;
    const connection = application.config.dbConnection;
    const CursosDAO = new application.app.models.CursosDAO(connection);

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro ao atualizar curso: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Curso ' + dados.descricao + ' atualizado com sucesso!'});
    };
    CursosDAO.atualizar([dados.id, dados.descricao, dados.sigla, dados.ativo], callback);
};
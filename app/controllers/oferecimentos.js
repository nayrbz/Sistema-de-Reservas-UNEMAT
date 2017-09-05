//  =====   RECUPERAÇÃO DE DADO   =====
module.exports.recuperarObjetos = (application, request, response) =>
{
    const usuario = request.query.usuario === undefined ? '%' : '%' + request.query.usuario + '%';
    const disciplina = request.query.disciplina === undefined ? '%' : '%' + request.query.disciplina + '%';
    const limit = request.query.limit;
    const offset = request.query.offset;

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na recuperação dos oferecimentos', error);
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
    const connection = application.config.dbConnection;
    const OferecimentosDAO = new application.app.models.OferecimentosDAO(connection);

    if (disciplina !== '%')
    {
        OferecimentosDAO.buscaIntervaloAtivoPorDisciplina(disciplina, limit, offset, callback);
        return;
    }
    if (usuario !== '%')
    {
        OferecimentosDAO.buscaIntervaloAtivoPorUsuario(usuario, limit, offset, callback);
        return;
    }
    OferecimentosDAO.buscaIntervaloAtivo(limit, offset, callback);
};

//  =====   ADMINISTRAÇÃO   =====
module.exports.administrar = (application, request, response) =>
{
    const callbackPeriodos = (error, results) =>
    {
        if (error)
        {
            console.log('Erro na recuperação dos oferecimentos', error);
        } else
        {
            dados.periodos = results.rows;
            const UsuariosDAO = new application.app.models.UsuariosDAO(connection);
            UsuariosDAO.buscaTodosAtivo(callbackUsuarios);
        }
    };

    const callbackUsuarios = (error, results) =>
    {
        if (error)
        {
            console.log('Erro na recuperação do usuários ativos', error);
        } else
        {
            dados.usuarios = results.rows;
            response.render('admin/oferecimentos', {dados: dados});
        }
    };

    let dados = {periodos: [], usuarios: [], disciplinas: []};
    const connection = application.config.dbConnection;
    const PeriodosDAO = new application.app.models.PeriodosDAO(connection);
    PeriodosDAO.buscarTodos(callbackPeriodos);
};

//  =====   CADASTRO   =====
module.exports.inserir = (application, request, response) =>
{
    const callbackVerificacaoPeriodoEUsuario = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na verificação de oferecimentos por período e usuário: ', error);
        } else
        {
            if (results.rowCount === 0)
            {
                OferecimentosDAO.inserirSemDisciplina(dadosForm.periodo, dadosForm.usuario, callbackInsercao);
            } else
            if (!results.rows[0].ativo)
                OferecimentosDAO.reativativar(results.rows[0].id, dadosForm.disciplina, callbackInsercao);
            else
                response.send({status: 'alert', title: 'Erro!', msg: 'Oferecimento já existe no banco.'});
        }
    };

    const callbackVerificacaoPeriodoEDisciplina = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na verificação de oferecimentos por período e disciplina: ', error);
        } else
        {
            if (results.rowCount === 0)
            {
                OferecimentosDAO.inserirComDisciplina(dadosForm.disciplina, dadosForm.periodo, dadosForm.usuario, callbackInsercao);
            } else
            if (!results.rows[0].ativo)
                OferecimentosDAO.reativativar(results.rows[0].id, dadosForm.disciplina, callbackInsercao);
            else
                response.send({status: 'alert', title: 'Erro!', msg: 'Oferecimento já existe no banco.'});
        }
    };

    const callbackInsercao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro no cadastro de oferecimento: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Oferecimento cadastrado com sucesso!'});
    };

    const dadosForm = request.body;
    const connection = application.config.dbConnection;
    const OferecimentosDAO = new application.app.models.OferecimentosDAO(connection);
    
    
    if (dadosForm.disciplina === '')
    {
        console.log(dadosForm.disciplina === '');
        OferecimentosDAO.buscaPorPeriodoEUsuario(dadosForm.periodo, dadosForm.usuario, callbackVerificacaoPeriodoEUsuario);
    }
    else
        OferecimentosDAO.buscaPorPeriodoEDisciplina(dadosForm.periodo, dadosForm.disciplina, callbackVerificacaoPeriodoEDisciplina);
};

//  =====   CANCELAMENTO   =====
module.exports.desativar = (application, request, response) =>
{
    const dadosForm = request.body;
    const connection = application.config.dbConnection;
    const OferecimentosDAO = new application.app.models.OferecimentosDAO(connection);

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro ao atualizar oferecimento: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Oferecimento atualizado com sucesso!'});
    };

    OferecimentosDAO.desativar(dadosForm.id, callback);
};
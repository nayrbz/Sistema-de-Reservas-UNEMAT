//  =====   RECUPERAÇÃO DE DADOS   =====
module.exports.recuperarObjetos = (application, request, response) =>
{
    const txconsulta = request.query.txconsulta === undefined ? '%' : '%' + request.query.txconsulta % '%';
    const limit = request.query.limit;
    const offset = request.query.offset;

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro: na recuperação das reservas', error);
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
    const ReservasDAO = new application.app.models.ReservasDAO(connection);

    ReservasDAO.buscaIntervalo(txconsulta, limit, offset, callback);
};

//  =====   ADMINISTRAÇÃO DOS RESERVAS   =====
module.exports.administrar = (application, request, response) =>
{
//    const callbackBuscaPeriodoAtivo = (error, results) =>
//    {
//        if (error)
//        {
//            response.send(error);
//        } else
//        {
//            response.render('admin/reservas', {periodo: results.rows[0]});
//        }
//    };

//    const connection = application.config.dbConnection;
//    const PeriodosDAO = new application.app.models.PeriodosDAO(connection);
//    PeriodosDAO.buscaAtivo(callbackBuscaPeriodoAtivo);
    response.render('admin/reservas');
};

//  =====   CADASTRO DE RESERVAS   =====
module.exports.inserir = (application, request, response) =>
{
    const callbackVerificacao = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na verificação da reserva: ', error);
        } else
        {
            if (results.rowCount === 0)
            {
                OperacoesDAO = new application.app.models.OperacoesDAO(connection);
                OperacoesDAO.inserirRecuperandoUltimoId({descricaoOperacao: dadosForm.descricaoOperacao}, callbackCadastroOperacao);
            } else
            {
                console.log(results.rows);
                response.send({status: 'alert', title: 'Erro!', msg: 'Reserva já existe.'});
            }
        }
    };

    const callbackCadastroOperacao = (error, results) =>
    {
        console.log(results.rows);
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na criação da operação: ', error);
        } else
        {
            ReservasDAO.inserir(
                    {
                        oferecimento: dadosForm.oferecimento,
                        objeto: dadosForm.objeto,
                        horarios: dadosForm.horarios,
                        datas: dadosForm.datas,
                        operacao: results.rows[0].id
                    },
                    callbackCadastroReserva);
        }
    };

    const callbackCadastroReserva = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na efetuação da reserva: ', error);
        } else
        {
            console.log(results.rows);
            response.send({status: 'success', title: 'Sucesso!', msg: 'Reserva cadastrada com sucesso!'});
        }
    };

    const dadosForm = request.body;
    const connection = application.config.dbConnection;
    const ReservasDAO = new application.app.models.ReservasDAO(connection);
//    console.log(dadosForm);
    ReservasDAO.buscaPorHorariosEDatas({horarios: dadosForm.horarios, datas: dadosForm.datas, objeto: dadosForm.objeto}, callbackVerificacao);
};

//  =====   ATUALIZAÇÃO DE RESERVAS   =====
module.exports.atualizar = (application, request, response) =>
{
    const dadosForm = request.body;
    const connection = application.config.dbConnection;
    const ReservasDAO = new application.app.models.ReservasDAO(connection);

    const callback = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro ao atualizar reserva: ', error);
        } else
            response.send({status: 'success', title: 'Sucesso!', msg: 'Reserva atualizado com sucesso!'});
    };
    ReservasDAO.atualizar(dadosForm.id, dadosForm.nome, dadosForm.data_inicio, dadosForm.data_fim, dadosForm.ativo, callback);
};
//  =====   RECUPERAÇÃO DE DADOS   =====
module.exports.recuperarObjetos = (application, request, response) =>
{
    const hoje = new Date();
    const data = request.query.data === undefined ? new Date(hoje.getFullYear() + '.' + (hoje.getMonth() + 1) + '.' + hoje.getDate()).getTime() / 1000 : request.query.data;
    let objetos = {};

    const callbackBuscaListaObjetos = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na recuperação dos objetos em reservas', error);
        } else
        {
            objetos = results.rows;
            ReservasDAO.buscaReservasDoDia({objetos: objetos, data: data}, callbackBuscaReservas);
        }
    };

    const callbackBuscaReservas = (error, results) =>
    {
        if (error)
        {
            response.send({status: 'alert', title: 'Erro!', msg: 'Erro no servidor.'});
            console.log('Erro na recuperação das reservas', error);
        } else
        {
            for (let i = 0; i < objetos.length; i++)
            {
                for (let j = 0; j < results.rows.length; j++)
                {
                    if (objetos[i].id === results.rows[j].objeto)
                    {
                        objetos[i] =
                                {
                                    descricao: objetos[i].descricao,
                                    id: results.rows[j].id,
                                    objeto: results.rows[j].objeto,
                                    oferecimento: results.rows[j].oferecimento,
                                    data: results.rows[j].data,
                                    mat_aula_1: results.rows[j].mat_aula_1,
                                    mat_aula_2: results.rows[j].mat_aula_2,
                                    mat_aula_3: results.rows[j].mat_aula_3,
                                    mat_aula_4: results.rows[j].mat_aula_4,
                                    almoco: results.rows[j].almoco,
                                    vesp_aula_1: results.rows[j].vesp_aula_1,
                                    vesp_aula_2: results.rows[j].vesp_aula_2,
                                    vesp_aula_3: results.rows[j].vesp_aula_3,
                                    vesp_aula_4: results.rows[j].vesp_aula_4,
                                    janta: results.rows[j].janta,
                                    not_aula_1: results.rows[j].not_aula_1,
                                    not_aula_2: results.rows[j].not_aula_2,
                                    not_aula_3: results.rows[j].not_aula_3,
                                    not_aula_4: results.rows[j].not_aula_4,
                                    ativo: results.rows[j].ativo,
                                    operacao: results.rows[j].operacao
                                };
                        break;

                    }
                }
                if (objetos[i].objeto === undefined)
                {
                    objetos[i] =
                            {
                                descricao: objetos[i].descricao,
                                id: 0,
                                objeto: 0,
                                oferecimento: 0,
                                data: 0,
                                mat_aula_1: false,
                                mat_aula_2: false,
                                mat_aula_3: false,
                                mat_aula_4: false,
                                almoco: false,
                                vesp_aula_1: false,
                                vesp_aula_2: false,
                                vesp_aula_3: false,
                                vesp_aula_4: false,
                                janta: false,
                                not_aula_1: false,
                                not_aula_2: false,
                                not_aula_3: false,
                                not_aula_4: false,
                                ativo: false,
                                operacao: 0
                            };
                }
            }
            response.send(JSON.stringify(
                    {
                        total: objetos.length,
                        rows: objetos
                    }
            ));
        }
    };


    const connection = application.config.dbConnection;
    const ReservasDAO = new application.app.models.ReservasDAO(connection);
    const ObjetosDAO = new application.app.models.ObjetosDAO(connection);

    ObjetosDAO.listarObjetosAtivosEmOrdemAlfabetica(callbackBuscaListaObjetos);
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
                response.send({status: 'alert', title: 'Erro!', msg: 'Reserva já existe.'});
            }
        }
    };

    const callbackCadastroOperacao = (error, results) =>
    {
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
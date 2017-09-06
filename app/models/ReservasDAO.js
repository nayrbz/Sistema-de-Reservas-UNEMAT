class ReservasDAO
{
    constructor(connection)
    {
        this._pool = connection;
        this._tabela = 'reservas';
    }

    busca(dados, callback)
    {
        let text = `SELECT
                        *
                    FROM
                        ${this._tabela};`;
//        console.log(text);
        this._pool.query(text, callback);
    }

    /*
     * 
     * @param {horarios: [{checked: boolean, campo: char}, datas: [integer]} dados
     * @param {function} callback
     * @returns {undefined}
     */
    buscaPorHorariosEDatas(dados, callback)
    {
        let text = '';
        dados.datas.forEach((item) =>
        {
            text += `SELECT
                        *
                    FROM
                        ${this._tabela}
                    WHERE
                        (\n`;
            dados.horarios.forEach((item) =>
            {
                if (item.checked === 'true')
                    text += item.campo + ' = ' + item.checked + ' OR \n';
            });
            text = text.substr(0, text. length -4) + '\n';
            text += `)
                    AND
                        data = ${item}
                    AND
                        objeto = ${dados.objeto}\nUNION\n`;
        });
        text = text.substr(0, text.length -7) + ';';
//        console.log(text);
        this._pool.query(text, callback);
    }

    /*
     * função para fazer cadastro de reservas
     * @param
     * {
     *   oferecimento: integer,
     *   objeto: integer,
     *   horarios:[{checked: boolean, campo: char]},
     *   horarios: [integer]
     * } dados
     * @param {function} callback
     * @returns {undefined}
     */
    inserir(dados, callback)
    {
        let text = '';
        dados.datas.forEach((item) =>
        {
            text += `INSERT INTO
                        ${this._tabela}
                        (
                            mat_aula_1,
                            mat_aula_2,
                            mat_aula_3,
                            mat_aula_4,
                            vesp_aula_1,
                            vesp_aula_2,
                            vesp_aula_3,
                            vesp_aula_4,
                            not_aula_1, 
                            not_aula_2,
                            not_aula_3,
                            not_aula_4,
                            almoco,
                            janta,
                            data,
                            objeto,
                            oferecimento,
                            operacao
                        )
                    VALUES
                        (
                            ${dados.horarios[0].checked},
                            ${dados.horarios[1].checked},
                            ${dados.horarios[2].checked},
                            ${dados.horarios[3].checked},
                            ${dados.horarios[4].checked},
                            ${dados.horarios[5].checked},
                            ${dados.horarios[6].checked},
                            ${dados.horarios[7].checked},
                            ${dados.horarios[8].checked},
                            ${dados.horarios[9].checked},
                            ${dados.horarios[10].checked},
                            ${dados.horarios[11].checked},
                            ${dados.horarios[12].checked},
                            ${dados.horarios[13].checked},
                            ${item},
                            ${dados.objeto},
                            ${dados.oferecimento},
                            ${dados.operacao}
                      );\n`;
        });
//        console.log(text);
        this._pool.query(text, callback);
    }
}

module.exports = () => ReservasDAO;

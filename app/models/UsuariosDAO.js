UsuariosDAO = function (connection)
{
    this._pool = connection;
    this._tabela = 'usuarios';
    /*      FUNÇÃO PARA RECUPERAR UM INTERVALO DE OBJETOS NO BANCO              */
    /*                 ['DESCRIAO', 'LIMIT', 'OFFSET']                          */
    this.buscaIntervalo = (adcionais, callback) =>
    {
        const text =
                `SELECT 
                        u.id AS id, u.nome AS nome, u.usr AS usr, u.ativo AS ativo, u.admin AS admin
                FROM
                        ${this._tabela} u
                WHERE
                        nome ILIKE \'${adcionais.txConsulta}\'
                ORDER BY
                        nome
                LIMIT
                        ${adcionais.limit}
                OFFSET
                        ${adcionais.offset};`;

        this._pool.query(text, callback);
    };
    /*    FUNÇÃO PARA RECUPERAR UM OBJETO DO BANCO               */
    this.buscarPorUsr = (txBusca, callback) =>
    {
        const text = `SELECT * FROM ${this._tabela} WHERE usr ILIKE \'${txBusca}\' LIMIT 1;`;
        this._pool.query(text, callback);
    };
    /*
     * 
     * @param {integer} id
     * @param {function} callback
     * @returns {undefined}
     */
    this.buscarPorId = (id, callback) =>
    {
        const text = `SELECT * FROM ${this._tabela} WHERE usr ILIKE \'${id}\' LIMIT 1;`;
        this._pool.query(text, callback);
    };
    /*         FUNÇÃO PARA INSERIR UM NOVO OBJETO NO BANCO                      */
    /*  A FUNÇÃO ESPERA UM ARRAY COM TRÊS VALORES: DESCRICAO COM 30 CARACTERES  */
    /*       NO MÁXIMO, UM BOOLEAN PARA ATIVO E A REFERENCIA                    */
    /*                   PARA O TIPO DO OBJETO                                  */
    /*          ['DESCRICAO', 'ATIVO', 'TIPO_OBJETO']                           */

    this.buscaTodosAtivo = (callback) =>
    {
        const text =
                `SELECT 
                    u.id AS id, u.nome AS nome, u.usr AS usr, u.ativo AS ativo, u.admin AS admin
                FROM
                    ${this._tabela} u
                WHERE
                    ativo = true
                ORDER BY
                    nome;`;

        this._pool.query(text, callback);
    };
    this.inserir = (values, callback) =>
    {
        const text = `INSERT INTO ${this._tabela} (nome, usr, passwd, admin, ativo) VALUES ($1, $2, $3, $4, $5);`;
        this._pool.query(text, values, callback);
    };

    /*
     * Atualiza Usuário com base no ID
     * @param {boolean} admin
     * @param {boolean} ativo
     * @param {integer} id
     * @param {char} nome
     * @param {char} passwd
     * @param {char} usr
     * @param {function} callback
     * @returns {undefined}
     */
    this.atualizarTudo = (admin, ativo, id, nome, passwd, usr, callback) =>
    {
        const text = `UPDATE 
                        ${this._tabela}
                      SET  
                        admin = ${admin}, ativo = ${ativo}, nome = \'${nome}\', passwd = \'${passwd}\', usr = \'${usr}\'
                      WHERE
                        ID = ${id};`;
//        console.log(text);
        this._pool.query(text, callback);
    };
    
        /*
     * Atualiza Usuário com base no ID
     * @param {boolean} admin
     * @param {boolean} ativo
     * @param {integer} id
     * @param {char} nome
     * @param {char} passwd
     * @param {char} usr
     * @param {function} callback
     * @returns {undefined}
     */
    this.atualizarSemSenha = (admin, ativo, id, nome, usr, callback) =>
    {
        const text = `UPDATE 
                        ${this._tabela}
                      SET  
                        admin = ${admin}, ativo = ${ativo}, nome = \'${nome}\', usr = \'${usr}\'
                      WHERE
                        ID = ${id};`;
//        console.log(text);
        this._pool.query(text, callback);
    };
};
module.exports = () => UsuariosDAO;

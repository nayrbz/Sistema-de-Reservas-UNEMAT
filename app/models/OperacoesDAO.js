/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class OperacoesDAO {

    constructor(connection)
    {
        this._pool = connection;
        this._tabela = 'operacoes';
    }
    
    /*
     * 
     * @param {descricaoOperacao: char} dados
     * @param {function} callback
     * @returns {undefined}
     */
    inserirRecuperandoUltimoId(dados, callback)
    {
        const text = `INSERT INTO
                        ${this._tabela} (descricao)
                    VALUES
                        (\'${dados.descricaoOperacao}\')
                    RETURNING
                        id;`;
//        console.log(text);
        this._pool.query(text, callback);
    }

}

module.exports = () => OperacoesDAO;
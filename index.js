let application = require('./config/server.js');

const port = 9999;

application.listen(port, () =>
{
    console.log(`\nServidor online na porta: ${port}`);
});

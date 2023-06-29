//Referência: https://blog.caelum.com.br/como-preparar-uma-aplicacao-react-para-o-deploy/amp/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const app = express();

const baseDir = `${__dirname}/build/`;

app.use(express.static(`${baseDir}`));

app.get('*', (req, res) => res.sendFile('index.html', { root: baseDir }));

const port = 3100;

app.listen(port, () => console.log(`Servidor subiu com sucesso em http://localhost:${port}`));

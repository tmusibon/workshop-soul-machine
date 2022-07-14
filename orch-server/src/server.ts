import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import app from './app';
import config from './config';
import {
  createWatsonAssistant,
  createSession,
  watsonMessage,
  watsonReset,
  fnGetSpeechResponse,
} from './watsonUtils';
import { addCardIfVariableFound, addCardIfActionFound } from './cardUtils';

//Create Watson Assitant service

let curr_session_id = null;
const assistant = createWatsonAssistant();
curr_session_id = createSession(assistant, curr_session_id);

var httpServer = null;
//config.production is false on Local Enviroment. True on prod.
if (config.production === false) {
  //Local host development, use HTTPS
  var privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf8');
  var certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
  var credentials = { key: privateKey, cert: certificate };
  httpServer = https.createServer(credentials, app);
} else {
  console.log('Production deployment');
  //Create HTTP only equivalents in a GCP deploy
  httpServer = http.createServer(app);
}

const wsServer = new WebSocket.Server({ server: httpServer });

httpServer.listen(config.express.port, () => {
  console.log(`Orchestration server listening on port ${config.express.port}`);
});

wsServer.on('connection', async (ws: WebSocket) => {
  // variables needs to be in within server connection scope
  const variables = {};
  console.log('Websocket connection established.');

  //connection is up, let's add a simple simple event
  ws.on('message', async (message: string) => {
    var messageObject = JSON.parse(message);

    if (
      messageObject?.kind === 'event' &&
      messageObject?.name === 'conversationRequest'
    ) {
      //Send textQuery to your Watson Assistant
      var textQuery = messageObject?.body?.input?.text;
      console.log(`Text query: `, textQuery);

      try {
        const messageRes = await watsonMessage(
          assistant,
          curr_session_id,
          textQuery
        );

        let spokenReturn = '';

        const resOutput = messageRes.result.output.generic;
        console.log(messageRes.result.output);

        resOutput.forEach((messageObject) => {
          if (messageObject.response_type === 'text') {
            spokenReturn = messageObject.text;
          }
        });

        const resContext =
          messageRes.result.context.skills['main skill'].user_defined;

        //If context variable set in Watson (ie $public-options = {data:[...]})
        addCardIfVariableFound(resContext, variables);

        //If context action set in Watson (ie $action = 'generic')
        addCardIfActionFound(resContext, variables);

        //*************API Routes*************//

        app.use('/health', (req, res) => {
          console.log('In /health');
          res.json({
            status: 'UP',
          });
        });

        app.get('/health', (req, res) => {
          console.log('In /health');
          res.json({
            status: 'UP',
          });
        });

        //Reset Watson
        app.post('/watson', (req, res) => {
          watsonReset(req.body.function, curr_session_id, res, ws);
        });

        const dataToSend = JSON.stringify(
          fnGetSpeechResponse(spokenReturn, variables)
        );
        ws.send(dataToSend);
      } catch (error) {
        console.log(
          `Error on watson assistant session connection and message sending`,
          error
        );
      }
    }
  });

  ws.addEventListener('error', function (event) {
    console.log('WebSocket error from Orchestration server: ', event);
  });
});

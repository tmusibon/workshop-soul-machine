const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

export const createWatsonAssistant = () => {
  const assistant = new AssistantV2({
    version: process.env.WATSON_ASSISTANT_VERSION, //latest version
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSON_ASSITANT_APIKEY,
    }),
    serviceUrl: process.env.WATSON_ASSITANT_SERVICEURL,
    disableSslVerification: true,
  });
  return assistant;
};

export const createSession = async (assistant, curr_session_id) => {
  const sessionRes = await assistant.createSession({
    assistantId: process.env.WATSON_ASSITANT_ID,
  });
  curr_session_id = sessionRes.result.session_id;
  console.log('Current Watson session ID: ', curr_session_id);
  return curr_session_id;
};

export const watsonMessage = async (assistant, curr_session_id, textQuery) => {
  curr_session_id = await _sessionId(curr_session_id, assistant);

  const messageRes = await assistant.message({
    assistantId: process.env.WATSON_ASSITANT_ID,
    sessionId: curr_session_id,
    userId: curr_session_id,
    input: {
      message_type: 'text',
      text: textQuery,
      options: {
        return_context: true,
      },
    },
  });
  return messageRes;
};

export const watsonReset = async (bodyFn, curr_session_id, res, ws) => {
  if (bodyFn === 'ResetID') {
    console.log('session timeout - just set the session ID to null');
    curr_session_id = null;
    res.send('Session ID set to null');
    ws.send('Session ID set to null');
  } else if (bodyFn === 'ResetConvo') {
    curr_session_id = null;
    let variables = {};
    console.log('should be resetting the conversation here');
    let spokenReturn = "Let's start over!";
    const infoToSend = JSON.stringify(
      fnGetSpeechResponse(spokenReturn, variables)
    );
    res.send('Restarting the conversation');
    ws.send(infoToSend);
  } else {
    curr_session_id = null;
    console.log('inactivity detected');
    res.send('Session ID set to null');
    ws.send('Reset successful');
  }
};

export const fnGetSpeechResponse = (speakThis, variables) => {
  const conversationResponse = {
    category: 'scene',
    kind: 'request',
    name: 'conversationResponse',
    transaction: null,
    body: {
      personaId: 1,
      output: {
        text: speakThis,
      },
      variables: variables,
    },
  };
  return conversationResponse;
};

const _sessionId = async (curr_session_id, assistant) => {
  if (curr_session_id === null) {
    const sessionRes = await assistant.createSession({
      assistantId: process.env.WATSON_ASSITANT_ID,
    });
    return (curr_session_id = sessionRes.result.session_id);
  }
  return curr_session_id;
};

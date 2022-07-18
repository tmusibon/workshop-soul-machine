# Customer Care / Soul Machines Workshop

This application combines [Watson Assistant](https://cloud.ibm.com/docs/assistant?topic=assistant-getting-started) and [Soul Machines](https://support.soulmachines.cloud/) to create a digital concierge.

## Installation

Install root dependencies

```sh
$ git clone https://github.ibm.com/skol-assets/workshop-soul-machine
$ cd workshop-soul-machine
$ npm install
```

Setup and Install

```sh
$ npm run setup
```

This will install all dependencies for each of the three services (react-ui, orch-server, and token-server),
copy the env.example to an .env file in each directory and create self signed certs for local development.

## Upload Sample Dialog Skill to Watson Assistant

Log in to https://cloud.ibm.com/

Create your Watson Assistant service, and Watson Assitant.

You can either switch to classic experience (top right of the screen drop down)

Create your new Assistant.

Click the blue button "Add an action or dialog skill".

Navigate to the "Upload Skill" tab.

Click the "Drag and drop file here or click to select a file"

Upload the reusable skill json (found in watson/)

## Update Environment Variables in .env For Each Service

**Only update the values where indicated**

Orchestration server env variables:

```sh
EXPRESS_SERVER=localhost
EXPRESS_PORT=3001
SSL_CERT=./certs/localhost.crt
SSL_KEY=./certs/localhost.key

# variables to connect to Watson Instance
WATSON_ASSITANT_SERVICEURL=https://api.us-south.assistant.watson.cloud.ibm.com
WATSON_ASSISTANT_VERSION=2021-11-27

######################### UPDATE #########################
# Update with correct values from your Watson Assistant instance
WATSON_ASSITANT_APIKEY=<Watson Assistant API Key>
WATSON_ASSITANT_ID=<Waton Assistant ID>
##########################################################
```

Token server env variables:

```sh
# Set these according to the Connection Config in Digital DNA Studio
SESSION_SERVER=dh.soulmachines.cloud

######################### UPDATE #########################
# Update with correct values from your Soul Machines persona instance
# Must first create your Persona in https://studio.soulmachines.cloud/
JWT_PUBLIC_KEY=<Soul machine persona Public Key from your Soul Machines instance>
JWT_PRIVATE_KEY=<Soul machine persona Private Key from your Soul Machines instance>
##########################################################

# UI Server hostname
UI_SERVER=localhost

# Production Persona must be set to true in Production Deployments
PRODUCTION_PERSONA=false

# Express Server will run on the following port / IP
EXPRESS_PORT=8080
EXPRESS_SERVER=0.0.0.0

# Orchestration server
ORCHESTRATION_SERVER=localhost:3001
CONTROL_VIA_BROWSER=true

# IBM Cloud Object Storage
# Create a Cloud Object Storage Bucket for recording audio
COS_ENDPOINT=
COS_APIKEYID=
COS_IBM_AUTH_ENDPOINT=
COS_RESOURCE_INSTANCE_ID=
COS_BUCKET=
```

React UI env variables

```sh
# env vars that are passed in to the react app need to be prefixed with REACT_APP_

# endpoint to token server corresponding to project's persona
REACT_APP_TOKEN_URL=http://localhost:8080/auth/authorize

#Custom UI must use an orchestration server
REACT_APP_ORCHESTRATION_MODE=true

# node environment (DEV or PROD)
NODE_ENV=dev

# local development server will serve app from this port
PORT=3000

# without this flag, any eslint errors will prevent the app from building (true or false)
ESLINT_NO_DEV_ERRORS=true

# true if prod mode - will hide the microphone mute button (true or false)
REACT_APP_PROD=false

# url to our reset conversation endpoint
REACT_APP_WATSON_URL="https://localhost:3001/watson"

# Audio Recording Flag
REACT_APP_AUDIO_RECORDING=
REACT_APP_AUDIO_SAVE_API=
```

## Run

From the root directory:

```sh
$ npm run dev
```

This should start up all three services.

Navigate to http://localhost:3000. The browser will ask you to accept the application's
use of your microphone and camera. Accept.

**The first time you run the services you will see the following message**

```sh
Encountered fatal error!

{
  "msg": "generic",
  "err": {
    "name": "controlFailed"
  }
}
```

Navigate to https://localhost:3001

If using **Chrome** type "thisisunsafe" in the browser.

If using **Firefox** click the button that says "Advanced..." and then click "Accept Risk and Continue"

Navigate back to http://localhost:3000 and refresh the page. You should see your persona!

## Structure

There are three directories in this repository:

```
/
│
└───react-ui: front-end for the app
│
└───token-server: token server for the app
│
└───orch-server: orchestration server for the app
```

We recommend setting these up in the order they are listed and ensuring each can run independently before running them all together.

## Linking an Orchestration Server

Soul Machines Digital People leverage NLP platforms to:

1. Understand the user’s intention or inquiry by analyzing their utterance.
2. Select the proper pre-written response from a finite set of responses.

> If you are using any of the supported NLP platforms, you can connect these services directly to your Digital Person from the Digital DNA Studio. However, if you are using another NLP platform or need a business logic layer between your Digital Person and your NLP, then Building an NLP Skill is recommended.

Alternatively, you can use an Orchestration Server. The Soul Machines Orchestration Layer is an additional layer of logic that is hosted on a separate server from the Soul Machines Cloud Platform, operated by the customer.

Soul Machines can provide you with the basic starting code template (In Node JS programming language) for the Orchestration Server. This template is completely customizable to suit any integration needs.

Note that you are required to host the Orchestration Server on your own infrastructure, and its endpoints must be publicly accessible

## DNA Studio Studio configuration

To use an Orchestration Server with a Digital DNA Studio deployed Digital Person, set the Conversation (NLP) Deployment option to Other in the Digital DNA Studio configuration screen.

Fill in the fields as required to establish the connection to your Orchestration Server.

When developing locally, it is possible to run an Orchestration Server locally for testing or debugging purposes. This requires the server URL (typically ‘localhost’) and your public IP to be specified. Note: if you have configured your orchestration server outside of Digital DNA Studio using your own token server, then leave the server URL blank and only specify your public IP.

In Production mode, developing locally is switched off and only a server URL is required (must be https or wss protocol for security).

## Important Links

- [Soul Machines Documentation](https://support.soulmachines.cloud/) - Contact [Morgan Carroll](mailto:morganc@ibm.com) for access
- [DDNA Studio](https://studio.soulmachines.cloud/) - Contact [Morgan Carroll](mailto:morganc@ibm.com) for access
- [Soul Machines Academy](https://soulmachinesacademy.thinkific.com/) - Contact [Morgan Carroll](mailto:morganc@ibm.com) for access
- [Watson Assistant Documentation](https://cloud.ibm.com/docs/assistant?topic=assistant-getting-started)
- [Watson Assistant API Docs](https://cloud.ibm.com/apidocs/assistant/assistant-v2)
- [IBM Cloud](https://cloud.ibm.com)

### Questions?

Contact via Slack:

- [Amir Sahib](https://ibm.enterprise.slack.com/user/@U0213D581DF)
- [David Levy](https://ibm.enterprise.slack.com/user/@U02225LE6A1)
- [Louis Rangel](https://ibm.enterprise.slack.com/user/@W8U657ATA)
- [Morgan Carroll](https://ibm.enterprise.slack.com/user/@W8U657ATA)

# Get Started With Token Server

## What is a Token Server and why is it required?

Token Server is a NodeJS application. The sole purpose of this sample is to serve up a Token for use in Custom UI development.

In order to connect your User Interface to a Digital Person project created in Digital DNA Studio, you must provide a JSON Web Token (JWT) verified by a Private Key provided by Soul Machines.

This provides a security mechanism which prevents anonymous or unauthorized access to your Digital Person project. You must pass the JWT when establishing a connection using the Soul Machines WebSDK.

Soul Machines provides a working implementation of a Token Server which only requires configuration of the connection details from Digital DNA Studio.

![Token Server Architecture](/docs/token-server.png)

## Initial Creatation

1. Create your avatar in [Soul Machine Digital DNA studio](https://studio.soulmachines.cloud/))
2. Once your avatar is live, Open it.
3. Expand your Connection Config, get those variables ready for next step.

## Localhost Development & Setup

### 1. Environment variable configuration

1. Create a .env file.
If you have one prepared 
- `touch .env`
and copy over its contents. Otherwise create copy of the example provided.
- `cp env.example .env .`

2. Set the following variables according to the Connection Details
   SESSION_SERVER = "Digital Person Server"
   JWT_PUBLIC_KEY = "Key Name"
   JWT_PRIVATE_KEY = "Private Key"
3. Set UI_SERVER to the hostname where the UI will be deployed
4. Production Persona must be set to true in Production Deployments

#### 1.a Integrating IBM COS
This is used to store the audio recordings we capture. There is an environment variable that enables this. When it is enabled we record short clips after Soul Machines starts trying to transcribe what the user is saying.  We then generate an MP3 audio file and store it in a COS bucket.

1. Set the following variables according to the Connection Details
   COS_ENDPOINT= "EXAMPLE: s3.us-south.cloud-object-storage.appdomain.cloud"
   COS_APIKEYID= "API Key"
   COS_IBM_AUTH_ENDPOINT= "Authentacation Endpoint"
   COS_RESOURCE_INSTANCE_ID= "Resource Instance ID"
   COS_BUCKET= "Cloud Object Storage Bucket"


### 3. Running locally

- Run `npm install` to install all dependencies
- Run `npm run dev` to start the localhost server
- To connect to your server from your frontend app, you will need to allow your self-signed cert to be used in Chrome. (if can't not by pass the Chrome Security, try use firefox instead)

  (Following example shows 3001 is the server port.)
  Navigate to your token server in your browser `https://localhost:3001/ping` and choose to "proceed to unsafe site".

- To validate the token being served, navigate to `https://localhost:3001/auth/authorize`

## Remote Deployment

- Run `npm run build` to create a build for remote deployment

## Docker Build and Run (to be updated)

1. Run `docker build . -t dfwtoken`.
2. Run `docker run -p 3001:3001 dfwtoken`.
3. Load localhost:3000 in your browser to verify.

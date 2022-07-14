
EXPRESS_SERVER: The IP address to bind the token server to when performing localhost 

EXPRESS_PORT: The port number for the token server when performing localhost development.
   Note if this is changed, your React template .ENV needs to be updated also

SSL_CERT: The relative path to the .crt file for localhost SSL

SSL_KEY: The relative path to the .key file for localhost SSL

# variable for initiate production mode
# NODE_ENV=production

# Variables for connecting to watson
When the variables are set we can connect to Watson and begin integrattion with soul machines.

WATSON_ASSITANT_SERVICEURL="EXAMPLE: https://api.us-south.assistant.watson.cloud.ibm.com "
WATSON_ASSISTANT_VERSION="EXAMPLE: 2021-11-27"
WATSON_ASSITANT_APIKEY="API KEY"
WATSON_ASSITANT_ID=d"Assitant ID"

# weather.com API key
By providing Longitude and Langitude we can serve local weather for any city a customer may be flying to.

WEATHER_API_KEY=123abc
WEATHER_URL=https://api.weather.com/v3

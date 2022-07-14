# Orchestration Server

1.  Edit the .env file and set the variables as per README_env.md
2.  Generate local ssl certificates as per README_ssl.md
3.  Run `npm install` to install dependencies
4.  Run `npm run dev` to run the orchestration server locally
5.  Open your UI server in your browser to interact with your Digital Person

## Important note for SSL Certs

Make sure to accept/trust the cert for it to work.

1. Get the wss url that fails (Example: `wss://localhost:3002/?access_token=eyJhbGciOiJIUzI1NiIsInR5c......`)
2. Paste it in the browser but change `wss` to `https`
3. Then now you get the typical insecure warning from the browser
4. In Chrome click anywhere and type `thisisunsafe` and this will accept the cert. In Firefox click "Advanced" and then "Accept the Risk and Continue".

## Docker Build and Run (to be updated)

1. Run `docker build . -t mvporch`.
2. Run `docker run -p 3002:3002 mvporch`.
3. Load localhost:3000 in your browser to verify.

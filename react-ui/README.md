# Get Started With Soul Machines React Reference UI

This React Reference UI is Javascript WebSDK is available via NPM at [Soul-Machine-Web-SDK](https://www.npmjs.com/package/@soulmachines/smwebsdk)

Additional Reference [Soul-Machine-Javascript-WebSDK-Documentation](https://soulmachines-support.atlassian.net/wiki/spaces/SSAS/pages/2326529/Web+Development+Kit+Reference+Guide)

## Prerequisites

Token Server configured and running locally. Please set up the token server first, ref to the readMe under server folder.

### `npm install`

Run to install the project's dependencies.

### Create a .env file.
If you have one prepared 
- `touch .env`
and copy over its contents. Otherwise create copy of the example provided.
- `cp env.example .env .`

1. Set REACT_APP_TOKEN_URL to the full address of the endpoint which serves the JWT Token. I.e. If you configured your token server locally using HTTPS and serving on port 3000:
   REACT_APP_TOKEN_URL=https://localhost:3000/auth/authorize
2. By default the application will run on port 3000. Override this by setting the PORT variable. Note changing the PORT number of the UI will require you set the CORS config correctly in the Token Server.
   Suggest use Experss Cors to enable.
3. set the PORT varible to match token server port

## Docker Build and Run

1. Run `docker build . -t mvpsmapp`.
2. Run `docker run -p 3000:3000 mvpsmapp`.
3. Load localhost:3000 in your browser to verify.

### `npm run dev`

This step execute the script defined in package.json under scripts.dev.
Once the webserver is started, navigate to http://localhost:3000 to view the application

### Run in (dev) Kiosk Mode

1. `npm run electron-dev`

### Build the prod Kiosk stand-alone application

1. `npm run electron-build`
2. `npm run electron-package`
3. See the `dist` folder for the .exe installer

## Linting & Code Style

This project strictly follows [AirBnB's JavaScript style guide](https://github.com/airbnb/javascript). We recommend you install [ESLint](https://eslint.org/) in your editor and adhere to its recommendations.

We have also provided an `.editorconfig` file that you can use in your editor to match the indentation, whitespace, and other styling rules we used in creating this template.

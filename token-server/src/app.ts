import * as express from 'express';
import { authRoutes } from './auth/auth-routes';
//import { audioRoutes } from './audio/audio-routes';
import { validateAppConfig } from './config/validate-config';
import { appConfig } from './config/app-config';

const cors = require('cors');
class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    // validate the env config
    validateAppConfig(appConfig);
    // enable cors
    this.app.use(cors());
    // support application/json
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    // auth routing
    this.app.use('/auth', authRoutes);
    // audio recording routing
    //this.app.use('/audio', audioRoutes)

    // health check
    this.app.get('/ping', (req, res) => {
      res.send('v1');
    });
  }
}

export default new App().app;

import { Request, Response, Router } from 'express';
import * as cors from 'cors';
import * as ibm from 'ibm-cos-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { appConfig } from '../config/app-config';

const myBucket = process.env.COS_BUCKET;

var config = {
  endpoint: process.env.COS_ENDPOINT,
  apiKeyId: process.env.COS_APIKEYID,
  serviceInstanceId: process.env.COS_RESOURCE_INSTANCE_ID,
};

var cos = new ibm.S3(config);

const upload = multer({
  storage: multerS3({
      s3: cos,
      bucket: myBucket,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, file.originalname);
      }
  })
});

class AudioRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {

    var corsOptions = {
      origin: [
        // allow deployed UI host
        `https://${appConfig.uiServer}`,
        // allow localhost with http/https and any port number / no port
        /https?:\/\/localhost(:[0-9]{0,5})?/
      ]
    }

    // use cors for all routes
    this.router.all('*', cors(corsOptions));

    this.router.post('/save', upload.single('file'),  (req: Request, res: Response) => {
      res.status(200).json({success:true});
    });


  }
}

export const audioRoutes = new AudioRoutes().router;

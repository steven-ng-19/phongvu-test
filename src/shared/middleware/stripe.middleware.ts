// import * as bodyParser from 'body-parser';

// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class RawBodyMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
//       if (err) {
//         return next(err);
//       }

//       req.rawBody = req.body;
//       console.log(req.rawBody);
//       next();
//     });
//   }
// }

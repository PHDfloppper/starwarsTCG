import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import { connect } from 'mongoose';


/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG = (
  'Express server started on port: ' + ENV.Port.toString()
);

connect("mongodb://localhost:27017/starwars")
  .then(() => server.listen("mongodb://localhost:27017/starwars", () => logger.info(SERVER_START_MSG)))
  .catch((err) => logger.err(err, true));
/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
server.listen(ENV.Port, err => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MSG);
  }
});

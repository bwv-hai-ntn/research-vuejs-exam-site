// tslint:disable-next-line: missing-jsdoc
import * as commandLineArgs from 'command-line-args';
import * as dotenv from 'dotenv';

const defaultValue = process.env.EXAM_SITE_NODE
  ? process.env.EXAM_SITE_NODE
  : 'development';

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue,
    type: String
  }
]);

// Set the env file
const result = dotenv.config({
  path: `./env/${options.env}.env`
});
if (result.error) {
  throw result.error;
}

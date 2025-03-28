import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// https://github.com/nodejs/node/issues/51196

register('ts-node/esm', pathToFileURL('./'));
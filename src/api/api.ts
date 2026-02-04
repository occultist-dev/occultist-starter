import {createServer} from 'node:http';
import {registry} from './registry.ts';
import {port} from '../config.ts';
import {type AddressInfo} from 'node:net';

import './actions/root.ts';
import './actions/todos.ts';


const server = createServer();

server.addListener('request', (req, res) => {
  registry.handleRequest(req, res);
});

server.listen(port, () => {
  const { address, port } = server.address() as AddressInfo;

  console.log(`Listening on http://${address}:${port}`);
  registry.finalize();

});

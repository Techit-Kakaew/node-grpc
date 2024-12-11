import { loadPackageDefinition, sendUnaryData, Server, ServerCredentials, ServerUnaryCall } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { DepartmentData, getTransformedData } from './dataProcessor';
import { fetchUserData } from './apiClient';
import { ServerErrorResponse, ServerStatusResponse } from '@grpc/grpc-js/build/src/server-call';

const PROTO_PATH = path.join(__dirname, 'proto', 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = loadPackageDefinition(packageDefinition) as any;

interface TransformedData {
  data: Record<string, DepartmentData>;
}

const server = new Server();

server.addService(proto.UserService.service, {
  GetTransformedUsers: async (_: ServerUnaryCall<any, any>, callback: sendUnaryData<TransformedData>) => {
    try {
      const users = await fetchUserData();
      const data = await getTransformedData(users);
      callback(null, { data });
    } catch (error) {
      callback(error as ServerErrorResponse | ServerStatusResponse | null, null);
    }
  },
});

server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
  console.log('gRPC Server running on port 50051');
});

import useWebSocket, { Options } from 'react-use-websocket';

export default function useDynamicWebSocket(options: Options) {
  const { protocol, hostname, port } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${hostname + ":" + port}/frontend`;
  console.log({wsUrl})

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, options);
  return { sendMessage, lastMessage, readyState };
}
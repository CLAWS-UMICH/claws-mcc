import useWebSocket, { Options } from 'react-use-websocket';

export default function useDynamicWebSocket(options: Options) {
  const { protocol, hostname } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${hostname}/frontend`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, options);
  return { sendMessage, lastMessage, readyState };
}
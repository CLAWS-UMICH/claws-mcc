import useWebSocket, { Options } from 'react-use-websocket';

const DEV_PORT = 8000;

export default function useDynamicWebSocket(options: Options) {
  const { protocol, hostname, } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${hostname + (hostname == 'localhost' ? ":" + DEV_PORT : '')}/frontend`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, options);
  return { sendMessage, lastMessage, readyState };
}
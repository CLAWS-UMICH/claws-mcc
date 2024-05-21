import useWebSocket, { Options } from 'react-use-websocket';

const DEV_PORT = 8000;

export default function useDynamicWebSocket(options: Options & { type: string }) {
  const { protocol, hostname } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${hostname + (hostname === 'localhost' ? ":" + DEV_PORT : '')}/frontend`;

  const enhancedOptions = {
    ...options,
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000
  };

  const { sendMessage, lastMessage: rawLastMessage, readyState } = useWebSocket(wsUrl, enhancedOptions);
  const lastMessage = rawLastMessage && JSON.parse(rawLastMessage.data);
  const isValidMessage = lastMessage && lastMessage.type === options.type;

  const connected = readyState === WebSocket.OPEN;

  return {
    sendMessage,
    lastMessage: isValidMessage ? rawLastMessage : null,
    readyState,
    connected
  };
}

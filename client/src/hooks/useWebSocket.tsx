import useWebSocket, { Options } from 'react-use-websocket';

const DEV_PORT = 8000;

export default function useDynamicWebSocket(options: Options & { type: string }) {
  const { protocol, hostname, } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${hostname + (hostname == 'localhost' ? ":" + DEV_PORT : '')}/frontend`;

  const { sendMessage, lastMessage: rawLastMessage, readyState } = useWebSocket(wsUrl, options);
  const lastMessage = rawLastMessage && JSON.parse(rawLastMessage.data);
  const isValidMessage = lastMessage && lastMessage.type === options.type;

  return {
    sendMessage,
    lastMessage: isValidMessage ? rawLastMessage : null,
    readyState
  };
}
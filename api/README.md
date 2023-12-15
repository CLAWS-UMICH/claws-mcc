# Mission Control API

This folder contains the backend code for the mission control server. The routes are defined in the `routes` folder and
the controllers are defined in the `controllers` folder. The file name correspond to the route name. For example, the
`routes/Waypoints.ts` file defines the `/api/waypoints` route and the `controllers/Astrounauts.ts` file defines the
`/api/astronauts` route.

## Websocket

There are two connections that we expect to be made to the server. The first is the connection from the client to the
server. This is the connection from the web browser to the server. The second is the connection from the hololens to
the server. The structure that these messages are expected to be in is defined in the `types` folder. The `types` and
is subject to change as the project evolves.

Every message is based off the base `Message` interface. To register new messages, add them to the `types` folder and
then add the corresponding event handler to `index.ts`. For example, if we wanted to add a message called `newMessage`
we would add the following to `types/NewMessage.ts`:

```typescript
export interface NewMessage extends Message {
    message: string;
}
```

Then we would implement the messageHandler in a separate file and add the following to `eventRegistry` variable in
`events.ts`:

```typescript
import newMesageHandler from "./newMessageHandler"

eventRegistry["myMessage"] = newMessageHandler;
```

Now, whenever the server receives a message with the `type` field set to `myMessage`, it will call the
`myMessageHandler`. The `data` parameter will be the message that was sent from the client.

The [documentation](https://docs.google.com/document/d/18RNM8NKaRakUNHwpRSnOFhq-FlS4D-d9yA84BSFio5g/edit?pli=1#heading=h.fsrwvowq28j5)
the websocket messages is in the google doc. We will try to keep this up to date as the project evolves.

# Mission Control API

This folder contains the backend code for the mission control server. The routes are defined in the `routes` folder. The
file name correspond to the route name. For example, the `routes/Waypoints.ts` file defines the `/api/waypoints` route
and the `routes/Astrounauts.ts` file defines the `/api/astronauts` route.

Table of contents:

- [HTTP Endpoints](#http-endpoints)
- [Websocket](#websocket)

## HTTP Endpoints

- [Astronauts](#astronauts)
- [Waypoints](#Waypoints)

### Astronauts

TODO: Add documentation for astronauts

### Waypoints

This route accepts three methods: `PUT`, `POST`, and `DELETE`. The `PUT` method adds the given waypoints to the list of
waypoints. The `POST` method updates the given waypoints. The `DELETE` method deletes the given waypoints. In all of
these cases, the input waypoint should be provided in the body of the request. The waypoint should be in the following
format:

```typescript
interface Waypoint {
    waypoint_id: number,
    location: { x: number, y: number },
    type: number,
    description: string
}
```

Here is one example of a waypoint:

```json
{
  "waypoint_id": 10,
  "location": {
    "x": 42.29294632866561,
    "y": -83.71641286188833
  },
  "type": 0,
  "description": "Bob and Betty Beyster Building",
  "author": -1
}
```

All of these fields are required. Whenever a waypoint is created, the server attaches an unmodifiable unique id to the
waypoint. This id is used to more easily update and delete waypoints. It is also provided in every transaction that
involves waypoints. For example, if the client sends a `PUT` request with the above waypoint, the server will respond
with the following:

```json
{
  "error": false,
  "message": "Added waypoints with ids: [1]",
  "data": [
    {
      "_id": "0xdeadbeef",
      "waypoint_id": 10,
      "location": {
        "latitude": 42.29294632866561,
        "longitude": -83.71641286188833
      },
      "type": 0,
      "description": "Bob and Betty Beyster Building",
      "author": -1
    }
  ]
}
```

**Note**: The `_id` field is actually an `ObjectId` object and not a hex string. To learn more, check
out [this](https://www.mongodb.com/developer/products/mongodb/bson-data-types-objectid/) article written by one of
MongoDb's engineers. Additionally, the `_id` field is not the same as the `waypoint_id` field. The `_id` field is the
unique id that the server uses to identify the waypoint. The `waypoint_id` field is the id that the client uses to
identify the waypoint. It is up to the client to ensure that the `waypoint_id` field is unique.

To edit a waypoint, the client should send a `POST` request with the following body:

```json
{
  "waypoint_id": 10,
  "location": {
    "x": 42.292373144315256,
    "y": -83.71310960407278
  },
  "type": 0,
  "description": "Electrical & Computer Engineering",
  "author": -1
}
```

Equivalently, the client could include the `_id` field in the body of the request. This will result in a faster lookup
time on the server if the `_id` is correct. If, for some reason, the client sends a nonexistent `_id`, the server will
lookup the waypoint by the `waypoint_id` field. Regardless of which fields are being updated, the client must include
all of the waypoint object's fields in the body of the request. The server will not update the waypoint if any of the
fields are missing. Proceeding with our example, the server will respond with the following:

```json
{
  "error": false,
  "message": "Updated waypoints with ids: [10]",
  "data": [
    {
      "_id": "0xdeadbeef",
      "waypoint_id": 10,
      "location": {
        "latitude": 42.292373144315256,
        "longitude": -83.71310960407278
      },
      "type": 0,
      "description": "Electrical & Computer Engineering",
      "author": -1
    }
  ]
}
```

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

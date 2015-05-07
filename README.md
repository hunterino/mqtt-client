
```html
<paper-button>flat button</paper-button>
<paper-button raised>raised button</paper-button>
<paper-button noink>No ripple effect</paper-button>
```
# mqtt-client

*mqtt-client* is a static element that performs the connection to a MQTT broker listening on a WebSocket TCP port.

This element must be declared inside every Polymer element that uses  *mqtt-client-sub* or *mqtt-client-pub*, everytime you use a *mqtt-** element.

### Attributes

**Attribute** | Type | Description | Default
--- | --- | --- | ---
**id** | string | **(required)** The id of the client component. More than one client that connect to different Broker could exist and work at the same time, so is important to identify all the clients in an application. | *undefined*
**host** | string | **(required)** Address of the broker | "127.0.0.1"
**port** | number | **(required)** Port of the websocket listener | 8000

### Methods

**Method** | Description
--- | ---
**connect()** | open the connection to the broker 
**disconnect()** | disconnect from the broker

### Example


# Installation

Using **bower**:

```
bower install --save mqtt-client
```

# MQTT-CLIENT

*mqtt-client* is a static element that performs the connection to a MQTT broker listening on a WebSocket TCP port.

This element must be declared inside every custom element that uses *mqtt-client-sub* or *mqtt-client-pub*. If multiple *mqtt-client* with the same *id* have been declared, only the one with *host* and *port* parameters manages the connection, the other only refers to that one. See **Separating elements**.

### Example

The following code instantiate the element and automatically connect to the broker:

```html
<template>
	<mqtt-client id="myclient"
	             host="broker.mqtt-dashboard.com"
	             port="8000"
	             connected="{{conn}}">
	</mqtt-client>
	<p>
		Connected: {{conn}}
	</p>
</template>
```

If you want to control the connection you should disable the *autoConnect* property:

```html
<template>
	<mqtt-client id="myclient"
	             host="broker.mqtt-dashboard.com"
	             port="8000"
	             autoConnect="false"
	             connected="{{conn}}">
	</mqtt-client>
	<p>
		<button type="submit" on-tap="{{connectEvent}}">{{conn ? "Disconnect" : "Connect"}}</button>
	</p>
</template>
<script>
	Polymer({
		connectEvent: function() {
            if (this.connected) {
                this.$.myclient.disconnect();
            } else {
                this.$.myclient.connect();
            }
        }
	});
</script>
```

### Attributes

**Attribute** | Type | Description | Default
--- | --- | --- | ---
**id** | string | **(required)** The id of the component. More than one client that connect to different Broker could exist and work at the same time, so is important to identify all the clients in an application. | *undefined*
**host** | string | **(required)** Address of the broker | ""
**port** | number | **(required)** Port of the broker's websocket listener | 0
**clientName** | string | Name of the client | *auto generated uuid*
**userName** | string | Username, if required by the broker | ""
**password** | string | Password | ""
**ssl** | boolean | Use SSL for the connection (wss) | false
**autoConnect** | boolean | Connect to the broker immediatly after the element is ready | true
**autoRetry** | boolean | In case of connection lost, the component will retry the connection every *timeout* seconds. All the subscriptions and the callbacks defined when the connection was up will be restored automatically | true
**timeout** | number | Interval in seconds for the *autoRetry* action and connection lost timeout | 3
**connected** | boolean | **(read only)** The state of the connection | false

### Methods

**Method** | Description
--- | ---
**connect()** | Open the connection to the broker 
**disconnect()** | Disconnect from the broker

# MQTT-CLIENT-SUB

*mqtt-client-sub* is an element which lets you subscribe to a topic.

### Example

The following code will connect to the broker and subscribes all the topics:

```html
<template>
	<mqtt-client id="myclient"
	             host="broker.mqtt-dashboard.com"
	             port="8000"
	             connected="{{conn}}">
	</mqtt-client>
	<mqtt-client-sub ref="myclient"
	                 topic="#"
	                 message="{{message}}"
	                 count="{{messageCount}}"></mqtt-client-sub>
	<p>
		Connected: {{conn}}<br>
		Message received: {{message}}<br>
		Message count: {{messageCount}}
	</p>
</template>
```

Of course you can subscribe multiple topics:

```html
<template>
	<mqtt-client id="myclient"
	             host="broker.mqtt-dashboard.com"
	             port="8000"
	             connected="{{conn}}">
	</mqtt-client>
	<mqtt-client-sub ref="myclient"
	                 topic="mytopic/one"
	                 message="{{message1}}"></mqtt-client-sub>
	<mqtt-client-sub ref="myclient"
	                 topic="othertopic/two"
	                 message="{{message2}}"></mqtt-client-sub>
	<p>
		Connected: {{conn}}<br>
		Message received from "mytopic/one": {{message1}}<br>
		Message received from "othertopic/two": {{message2}}
	</p>
</template>
```

### Attributes

**Attribute** | Type | Description | Default
--- | --- | --- | ---
**ref** | string | **(required)** The id of the *mqtt-client* component which manage the connection | *undefined*
**topic** | string | **(required)** Topic to subscribe. Standard wildcards (# and +) are supported. After the subscription, this attribute will contain the topic reltive to the *message* received | ""
**message** | string | **(read only)** The message payload received from the broker | ""
**count** | number | **(read only)** Progressive number, increased every time a message is received. Useful when the payload (and so the *message* attribute) don't change among contiguous messages | 0
**qos** | number | Quality of service | 0
**autoRetry** | boolean | Automatically retry the subscription if the connection was down when the element was instantiated | true

# MQTT-CLIENT-PUB

Publish messages on a topic.

### Example

The following code connects to the broker, subscribes a specific topic and lets you enter a message to publish:

```html
<template>
	<mqtt-client id="myclient"
	             host="broker.mqtt-dashboard.com"
	             port="8000"
	             connected="{{conn}}">
	</mqtt-client>
	<mqtt-client-sub ref="myclient"
	                 topic="demo/polymer"
	                 message="{{messageSub}}"></mqtt-client-sub>
	<mqtt-client-pub ref="myclient"
	                 topic="{{topic}}"
	                 message="{{message}}"
	                 id="publisher1"></mqtt-client-pub>
	<p>
		Connected: {{conn}}<br>
		Message received from "demo/polymer": {{messageSub}}<br>
	</p>
	<p>
		Publish a message:<br>
		Topic: <input value="{{topic}}"><br>
		Message: <input value="{{message}}"><br>
		<button type="submit" on-tap="{{sendEvent}}">Publish</button>
	</p>
</template>
<script>
	Polymer({
		topic: "demo/polymer",
		sendEvent: function() {
            this.$.publisher1.go();
        }
	});
</script>
```

### Attributes

**Attribute** | Type | Description | Default
--- | --- | --- | ---
**ref** | string | **(required)** The id of the *mqtt-client* component which manage the connection | *undefined*
**topic** | string | **(required)** Topic to publish to | ""
**message** | string | **(read only)** The message payload to publish | ""

### Methods

**Method** | Description
--- | ---
**go()** | Publish the message 



# Separating elements

The architecture of the *mqtt-client* lets you dislocate the elements between the components of your application. For instance, you could connect to the broker on a custom element, publish and/or receive messages inside other custom elements.

### Example

This example shows an ipotetic separation scenario. On every custom element you must instantiate the *mqtt-client* but provide the connection information only once:

```html
<polymer-element name="custom-element-1">
	<template>
		<mqtt-client id="myclient" host="broker.mqtt-dashboard.com" port="8000">
		</mqtt-client>
	</template>
</polymer-element>

<polymer-element name="custom-element-2">
	<template>
		<mqtt-client id="myclient"></mqtt-client> <!-- refers to the myclient defined in custom-element-1 -->
		<mqtt-client-sub ref="myclient" topic="#" message="{{message}}"></mqtt-client-sub>
		{{message}}
	</template>
</polymer-element>

<polymer-element name="custom-element-3">
	<template>
		<mqtt-client id="myclient"></mqtt-client> <!-- refers to the myclient defined in custom-element-1 -->
		<mqtt-client-pub ref="myclient" topic="foo" message="hey" id="publisher1"></mqtt-client-pub>
		<button type="submit" on-tap="{{sendEvent}}">Say Hey!</button>
	</template>
	<script>
		Polymer({
			sendEvent: function() {
	            this.$.publisher1.go();
	        }
		});
	</script>
</polymer-element>
```

# Multiple connections

Of course you can manage multiple brokers at the same time inside your elements:

```html
<template>
	<mqtt-client id="myclient" host="broker.mqtt-dashboard.com" port="8000"></mqtt-client>
	<mqtt-client id="otherclient" host="127.0.0.1" port="8000"></mqtt-client>
	<mqtt-client-sub ref="myclient" topic="#" message="{{message1}}"></mqtt-client-sub>
	<mqtt-client-sub ref="otherclient" topic="#" message="{{message2}}"></mqtt-client-sub>
	<p>{{message1}}</p>
	<p>{{message2}}</p>
</template>
```

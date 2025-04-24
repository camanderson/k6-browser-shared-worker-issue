self.addEventListener('connect', (event) => {
  const port = event.ports[0];

  port.postMessage('Hello from the Shared Worker!');

  port.onmessage = (event) => {
    console.log('Message received from main thread:', event.data);
  }

  port.start();
});
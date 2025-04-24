import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

// Register the shared worker
if (window.SharedWorker) {
    const worker = new SharedWorker(new URL('./shared-worker.js', import.meta.url));

    // Listen for messages from the worker
    worker.port.onmessage = (event) => {
        alert(event.data);
    };

    // Start the worker port
    worker.port.start();
}

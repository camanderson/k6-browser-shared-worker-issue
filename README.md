# k6-browser-shared-worker-issue

MVP to replicate an issue with shared workers in k6/browser

## Steps to replicate the issue locally

These steps will detail how to install and run locally to view expected behavior, then how to replicate the issue through a k6/browser test.

### Start local server and view expected behavior

- `npm i`
- `npm run dev` to start local server

  - Navigate to <http://localhost:5147/> to calidate shared worker creates alert with message "Hello from the Shared Worker!"
  - Close the alert and refresh the page, the alert should re-appear
  - Increment the counter on the homepage before refreshing to see page is refreshing when counter goes back to `0`

### Replicate issue with k6/browser

- Run `npm run test` in a new terminal from the server to start k6/browser test

  - k6 will open a new chrome window and the shared worker alert will flash in and out rapidly before fully going away

    - I believe this flickering is what allows my sso shared worker to initiate the auth flow in my actual workflow, but then not able to confirm auth status when the page returns

  - Refreshing the page will not bring the alert back, this can be validated with the counter, similarly to the expected behavior

- Return partial shared worker functionality

  - Without closing the test, open a new tab in the k6/browser chrom instance and navigate to <chrome://inspect/#workers>
  - From this page you can see the `untitled` shared worker, click the `inspect` button just below it to open the DevTools window for the shared worker
  - Return to the `Vite + Vue` tab in the k6/browser chrome instance and reload the page, the shared worker alert will flicker for about 1 second every time the page is reloaded
  - This shows that without inspecting the shared worker, there is something causing it to flicker or function in an unexpected manner

## Additional debug steps taken

To prove this was not an issue with any of the launch flags used in the k6/browser chrome instance, I navigate to <chrome://verson> and cpoied the `Command Line` value seen here:

```sh
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-default-apps --disable-prompt-on-repost --force-color-profile=srgb --metrics-recording-only --no-first-run --disable-background-timer-throttling --disable-breakpad --disable-component-extensions-with-background-pages --use-mock-keychain --no-service-autorun --no-startup-window --window-size=800,600 --disable-background-networking --disable-dev-shm-usage --disable-features=ImprovedCookieControls,LazyFrameLoading,GlobalMediaControls,DestroyProfileOnBrowserClose,MediaRouter,AcceptCHFrame --disable-hang-monitor --enable-automation --password-store=basic --enable-features=NetworkService,NetworkServiceInProcess --disable-extensions --disable-ipc-flooding-protection --disable-popup-blocking --disable-renderer-backgrounding --no-default-browser-check --user-data-dir=/var/folders/4h/dgn6q8k542d7k4kkd30rfw180000gn/T/k6browser-data-438063324 --disable-backgrounding-occluded-windows --remote-debugging-port=0 --flag-switches-begin --flag-switches-end
```

I then escaped the space in `Google\ Chrome` twice at the start and removed the `--no-startup-window` flag and ran the command, opening a new chrome instance. From there I navigated to <http://localhost:5147/> to confirm the shared worker operated as expected. Because of that, I have concluded something in the way k6 or k6/browser opertate is affecting the performance of shared workers during tests.

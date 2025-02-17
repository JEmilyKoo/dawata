import React, { useRef } from 'react'
import { Button, View } from 'react-native'
import { WebView } from 'react-native-webview'

export default function App() {
  const webViewRef = useRef<WebView>(null)

  const sendMessageToWebView = () => {
    const message = JSON.stringify({
      type: 'update',
      value: 'Hello from React Native!',
    })
    webViewRef.current?.postMessage(message)
  }

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Send Message to WebView"
        onPress={sendMessageToWebView}
      />
      <WebView
        ref={webViewRef}
        source={{
          html: `
          <!DOCTYPE html>
          <html>
          <head>
            <script>
              window.addEventListener('message', (event) => {
                console.log('📩 Received message:', event.data);
                document.getElementById('message').innerText = event.data;
              });
            </script>
          </head>
          <body>
            <h1>WebView</h1>
            <p id="message">Waiting for message...</p>
          </body>
          </html>
        `,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          console.log('📩 WebView → React Native:', event.nativeEvent.data)
        }}
      />
    </View>
  )
}

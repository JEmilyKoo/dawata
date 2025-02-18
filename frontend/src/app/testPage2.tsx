import React, { useRef, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { WebView } from 'react-native-webview'

const WebViewTest = () => {
  const webViewRef = useRef<WebView | null>(null)
  const [nativeText, setNativeText] = useState('')
  const [webviewText, setWebviewText] = useState('')

  const sendMessageToWebView = (message: string) => {
    return `document.getElementById('webviewtextbox').value = '${message}';`
  }

  const sendToWebView = () => {
    const message = `in react native ${new Date()}`
    webViewRef.current?.injectJavaScript(sendMessageToWebView(message))
  }

  const handleOnMessage = (event: any) => {
    setNativeText(event.nativeEvent.data)
  }

  const onMessage = (event: unknown) => handleOnMessage(event)

  const webViewContent = `
    <!DOCTYPE html>
    <html>
    <body>
      <input type="text" id="webviewtextbox" />
      <button id="webviewButton">Send to React Native</button>
      <script>
        document.getElementById('webviewButton').addEventListener('click', function() {
          window.ReactNativeWebView.postMessage('in webview ' + new Date());
        });
        window.addEventListener('message', function(event) {
          document.getElementById('webviewtextbox').value = event.data;
        });
      </script>
    </body>
    </html>
  `

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={(ref) => (webViewRef.current = ref)}
        originWhitelist={['*']}
        source={{ html: webViewContent }}
        onMessage={onMessage}
      />
      <TextInput
        value={nativeText}
        editable={false}
        style={{ borderWidth: 1, margin: 10, padding: 5 }}
      />
      <Button
        title="Send to WebView"
        onPress={sendToWebView}
      />
    </View>
  )
}

export default WebViewTest

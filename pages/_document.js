import Document, { Html, Head, NextScript, Main } from 'next/document';

export default class MyDocunment extends Document {
  render() {
    return (
      <Html lang="es-ES">
        {/* <Head></Head> */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

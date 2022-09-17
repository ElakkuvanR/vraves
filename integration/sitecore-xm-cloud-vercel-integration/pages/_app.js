import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { TokenContextProvider } from "store/token-context";

function MyApp({ Component, pageProps }) {
  return (
    <TokenContextProvider>
      <Component {...pageProps} />
    </TokenContextProvider>
  );
}



export default MyApp;
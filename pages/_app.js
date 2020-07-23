import 'styles/normalize.sass'
import 'styles/global.sass'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import 'react-dropdown/style.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
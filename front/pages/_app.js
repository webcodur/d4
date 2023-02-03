import Head from "next/head";
import GlobalStyles from "../styles/globalStyles";
import { ThemeProvider } from "styled-components";
import theme from '../styles/theme';
import '../styles/app.css';

import Header from '../components/header/header';

const app = ({ Component }) => {
  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
      <Head>
        <title>조용할지도</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
        <link rel="icon" href="./images/favicon_32.png" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
      </Head>

      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Header />
        <div>
          <Component />
        </div>
      </ThemeProvider>
    </>
  );
}

export default app;

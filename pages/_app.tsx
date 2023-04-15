import Layout from "@/components/common/Layout/Layout";
import { colors } from "@/config/theme";
import { AuthProvider } from "@/context/AuthContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { ReactElement, ReactNode } from "react";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin-ext"],
});

const theme = extendTheme({ colors });

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <main className={poppins.className}>
          {getLayout(<Component {...pageProps} />)}
        </main>
      </ChakraProvider>
    </AuthProvider>
  );
}

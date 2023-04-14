import { colors } from "@/config/theme";
import { AuthProvider } from "@/context/AuthContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin-ext"],
});

const theme = extendTheme({ colors });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
      </ChakraProvider>
    </AuthProvider>
  );
}

import { authCookieKey } from "@/utils/auth";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function Home() {
  return (
    <>
      <h1>Olá mundo</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { [authCookieKey]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};

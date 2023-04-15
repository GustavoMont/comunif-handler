import React, { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Sidebar>
        <main>{children}</main>
      </Sidebar>
    </>
  );
};

export default Layout;

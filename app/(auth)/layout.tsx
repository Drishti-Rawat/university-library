
import React , { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
       
          {children}


        </main>
  );
}
export default layout;
"use client";

import Footer from "../../Components/Footer";
import Top from "../Top";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Rare Combee Group</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="the page description" />
      </head>
      <body>
        <Top />
        {children}
        <Footer />
      </body>
    </html>
  );
}

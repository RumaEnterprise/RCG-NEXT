import Render from "./render";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Rare Combee Group</title>
        <link rel="canonical" href="http://localhost:3000" />
        <meta name="description" content="the page description"/>
      </head>
      <body>
        <Render children={children} />
        
      </body>
    </html>
  );
}

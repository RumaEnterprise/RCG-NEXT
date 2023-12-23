import Render from "./Render";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Home | Rare combee Group</title>
        <link rel="icon" href="https://api.rarecombee.com/admin/image?name=RCG_logo.png"/>
        <link rel="canonical" href='/' />
        <meta name="robots" content="all"/>
      </head>
      <body>
        <Render children={children} />
      </body>
    </html>
  );
}
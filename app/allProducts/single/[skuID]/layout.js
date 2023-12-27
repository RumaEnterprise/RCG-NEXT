"use client";

import { useParams } from "next/navigation";

export default function ProductSingleLayout({ children }) {
  let { skuID } = useParams();
  return (
    <>
      <head>
        <title>{`${skuID} | Rare Combee Group`}</title>
      </head>
      {children}
    </>
  );
}

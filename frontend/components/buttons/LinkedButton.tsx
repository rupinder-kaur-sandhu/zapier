"use client";

import { ReactNode } from "react";

export const LinkedButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className=" flex justify-center px-2 py-2 cursor-pointer hover:bg-slate-100 font-light text-base rounded"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

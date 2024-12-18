"use client";
import { useRouter } from "next/navigation";
import { LinkedButton } from "./buttons/LinkedButton";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
  const router = useRouter();
  return (
    <div className="flex border-b justify-between p-4">
      <div className="flex flex-col justify-center text-2xl font-extrabold">
        Zapier
      </div>
      <div className="flex">
        <div className="pr-4">
          <LinkedButton onClick={() => {}}>Contact Sales</LinkedButton>
        </div>
        <div className="pr-4">
          <LinkedButton
            onClick={() => {
              router.push("/login");
            }}
          >
            Log in
          </LinkedButton>
        </div>
        <PrimaryButton
          size="small"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Signup
        </PrimaryButton>
      </div>
    </div>
  );
};

"use client";
import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRouter } from "@/node_modules/next/navigation";

export default function () {
  const router = useRouter();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <div>
      <Appbar></Appbar>
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl">
          <div className="flex-1 pt-20 px-4">
            <div className="font-semibold text-3xl pb-4">
              Join millions worldwide who automate their work using Zapier.
            </div>
            <div className="pb-6 pt-4">
              <CheckFeature
                label={"Easy setup,no coding required"}
              ></CheckFeature>
            </div>
            <div className="pb-6">
              <CheckFeature
                label={"Free forever for core features"}
              ></CheckFeature>
            </div>
            <CheckFeature
              label={"14-day trial of premium features & apps"}
            ></CheckFeature>
          </div>
          <div className="flex-1 pt-12 pb-12 mt-12 px-4 border rounded">
            <Input
              label={"Name"}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Your Name"
            ></Input>
            <Input
              label={"Email"}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              placeholder="Your Email"
            ></Input>
            <Input
              label={"Password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
            ></Input>
            <div className="pt-4">
              <PrimaryButton
                onClick={async () => {
                  const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signup`,
                    {
                      username: email,
                      password,
                      name,
                    }
                  );
                  router.push("/login");
                }}
                size="big"
              >
                Get started free
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

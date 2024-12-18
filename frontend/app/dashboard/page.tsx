"use client";
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import axios from "axios";
import { LinkedButton } from "@/components/buttons/LinkedButton";
import { useRouter } from "@/node_modules/next/navigation";

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setZaps(res.data.zaps);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    zaps,
  };
}

export default function () {
  const { loading, zaps } = useZaps();
  const router = useRouter();
  return (
    <div>
      <Appbar></Appbar>
      <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg w-full">
          <div className="flex justify-between pr-8">
            <div className="text-2xl font-bold">My Zaps</div>
            <DarkButton
              onClick={() => {
                router.push("/zap/create");
              }}
            >
              Create
            </DarkButton>
          </div>
        </div>
      </div>
      {loading ? (
        "Loading....."
      ) : (
        <div className="flex justify-center">
          <ZapTable zaps={zaps}></ZapTable>
        </div>
      )}
    </div>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-screen-lg w-full">
      <div className="flex">
        <div className="flex-1">Name</div>
        <div className="flex-1">Id</div>
        <div className="flex-1">Created at</div>
        <div className="flex-1">Webhook URL</div>
        <div className="flex-1">Go</div>
      </div>
      {zaps.map((z) => (
        <div className="flex border-b py-4 border-t">
          <div className="flex-1 flex">
            <img src={z.trigger.type.image} className="w-[30px] h-[30px]"></img>
            {z.actions.map((x) => (
              <img src={x.type.image} className="w-[30px] h-[30px]"></img>
            ))}
          </div>
          <div className="flex-1">{z.id}</div>
          <div className="flex-1">Nov,13 2024</div>
          <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
          <div className="flex-1">
            <LinkedButton
              onClick={() => {
                router.push("/zap/" + z.id);
              }}
            >
              Go
            </LinkedButton>
          </div>
        </div>
      ))}
    </div>
  );
}

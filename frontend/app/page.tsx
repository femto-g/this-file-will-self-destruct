"use client";

import Card from "@/components/card/Card";
import CardContent from "@/components/card/CardContent";
import CardHeader from "@/components/card/CardHeader";
import CardIcons from "@/components/card/CardIcons";
import CardText from "@/components/card/CardText";
import CardFooter from "@/components/card/CardFooter";
import Image from "next/image";
import IconImage from "@/components/image/IconImage";
import icons from "@/assets/icons";
import Link from "next/link";
import useResponsiveRender from "@/hooks/useResponsiveRender";
import useBreakpoint from "@/hooks/useBreakpoint";
import Heading1 from "@/components/heading/Heading1";
import { FormSubmitInput } from "@/components/form/FormSubmitInput";
import { apiGet } from "@/api/client";
import { useState } from "react";

export default function Home() {
  const render = useResponsiveRender();
  const mediumScreen = useBreakpoint("md");

  const [displayShare, setDisplayShare] = useState<Boolean>(false);
  const [shareUrl, setShareUrl] = useState<String>();

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      fileInput: { files: [1] };
    };
    const file = target.fileInput.files[0] as any;
    const type = file.name.split(".").pop();
    const response = await apiGet({ endpoint: `upload-url?extension=${type}` });
    const { url, key } = await response.json();
    await fetch(url, {
      method: "PUT",
      body: target.fileInput.files[0] as unknown as BodyInit,
    });
    setDisplayShare(true);
    setShareUrl(`http://localhost:3000/file/${key}`);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5 pt-5">
          <Heading1>This File Will Self Destruct</Heading1>
          <p className="text-2xl text-center">
            Upload a file to share a one-time download link. Once it's
            downloaded, it's gone.
          </p>
          <form onSubmit={uploadFile}>
            <input type="file" id="fileInput" />
            <FormSubmitInput />
          </form>
        </div>
        {displayShare ? <div>Share : {shareUrl}</div> : null}
      </div>
    </div>
  );
}

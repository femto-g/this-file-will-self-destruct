"use client";
import { apiGet } from "@/api/client";
import Heading1 from "@/components/heading/Heading1";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params }: { params: { filename: string } }) {
  const onDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const response = await fetch(data, {
      method: "GET",
      headers: {
        "Content-Disposition": "attachment",
      },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", params.filename);
    document.body.appendChild(link);
    link.click();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["filename"],
    queryFn: async () => {
      const response = await apiGet({
        endpoint: `download-url?key=${params.filename}`,
      });
      const { url } = await response.json();
      return url;
    },
  });

  if (data) {
    return (
      <div className="flex flex-col items-center">
        <Heading1>Download this file.</Heading1>
        <div className="mt-10 border border-black p-5">
          <p className="">{params.filename}</p>
          <button
            onClick={onDownload}
            className="border-2 border-black rounded-md p-1 active:bg-gray-400"
          >
            Download
          </button>
        </div>
      </div>
    );
  } else return null;
}

"use client";

import { ImageOff, Loader, PencilLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { minio_img_url } from "@/constants";
import { useMeStore } from "@/store/me-store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UploadFile = ({
  getUploadValue,
  type,
  localPropsUrl
}: {
  getUploadValue: (uuid: string) => void;
  type:string;
  localPropsUrl?:string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localUrl,setLocalUrl] =useState<string>(localPropsUrl ||'')
  const { meUser } = useMeStore();
  const [isloading,setIsloading] =useState<boolean>(false)

  useEffect(()=>{
   if(localPropsUrl)  setLocalUrl(localPropsUrl )
  }, [localPropsUrl])
  useEffect(()=>{
     if(meUser?.avatar?.path && type =='avatar')  setLocalUrl(meUser?.avatar?.path)
  },[meUser?.avatar])
  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsloading(true)
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);
    formData.append("type",  type);

    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + `media-upload/single/${type}/${type}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        }
      );
      const contentType = response.headers.get("content-type");
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setLocalUrl(data?.path||data?.[0]?.path)
        if(getUploadValue) getUploadValue(data?.id||data?.[0]?.id);
      } 
      setIsloading(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to upload image:", error);
      setIsloading(false)
    }
  };

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="rounded-[12px]">
     {type == 'avatar'?  <div className="relative flex items-center mx-auto justify-center border-border border rounded-full  w-[100px] h-[100px]">
        <Avatar className="w-[100px] mx-auto h-[100px]">
          {localUrl? (
            <AvatarImage
              src={
                minio_img_url +localUrl || undefined
              }
              alt="@shadcn"
            />
          ) : (
            <AvatarFallback className=" bg-transparent">
              {(meUser?.firstName?.[0] || "").toUpperCase() +
                (meUser?.lastName?.[0] || "").toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <PencilLine
          onClick={handleIconClick}
          
          className="bg-[#FF7700] text-white w-[24px] cursor-pointer h-[24px] p-1.5 rounded-full absolute top-0 right-0 flex items-center justify-center"
        />
      </div>: 
      <>
    
        <div
            onClick={handleIconClick}
          style={{ aspectRatio: "1/1" }}
          className="flex items-center cursor-pointer rounded-[12px]  max-w-[300px] mx-auto border-border border justify-center flex-col"
        >
          {
            localUrl ?
            <img
            style={{ aspectRatio: "1/1" }}
             className="flex items-center cursor-pointer  max-w-[300px] mx-auto border-border border justify-center flex-col"
            src={
             minio_img_url +localUrl || undefined
           }/>:<>
            { isloading? <Loader className="text-primary text-[20px] w-[60px] h-[60px]" />: <ImageOff className="text-primary text-[20px] w-[60px] h-[60px]" />}
             <p className="text-[18px] font-semibold text-primary mt-2">Нет фото</p></>
          }
        
        </div>
      
      

      </>}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

"use client";
import React from "react";

import config from "@/lib/config";
import { Video, ImageKitProvider } from '@imagekit/next';

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {


  return (
    <ImageKitProvider

      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <Video src={videoUrl} controls={true} className="w-full rounded-xl" />
    </ImageKitProvider>
  );
};
export default BookVideo;

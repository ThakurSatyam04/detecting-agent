'use client'

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {load as cocoSSDLoad} from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import {renderPredictions} from "@/utils/render-detection"

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async() =>{
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);
    detectInterval = setInterval(()=>{
      runObjectDetection(net);
    },10);
  }

  const runObjectDetection = async (net) =>{
    if(canvasRef.current && webCamRef.current !== null && webCamRef.current.video?.readyState === 4){
      canvasRef.current.width = webCamRef.current.video.videoWidth;
      canvasRef.current.height = webCamRef.current.video.videoHeight;

      // find detected object
      const detectedObject = await net.detect(webCamRef.current.video, undefined, 0.6);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObject, context);
    }
  }

  const showMyVideo = ()=>{
    if(webCamRef.current !== null && webCamRef.current.video?.readyState === 4){
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;

      webCamRef.current.video.width = myVideoWidth;
      webCamRef.current.vide.height = myVideoHeight;
    }
  }

  useEffect(()=>{
    runCoco();
    showMyVideo();
  },[])
  
  return (
    <div className="mt-8">
      {/* Webcam */}
      {
        isLoading? (
          <h2>Loading AI models</h2>
        ) :
        (<div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
        <Webcam ref = {webCamRef} className="rounded-md w-full lg:h-[720px]" muted />
      </div>)
      }
      {/* canvas */}
      <canvas ref={canvasRef}
      className="absolute top-0 left-0 z-9999 w-full lg:h-[720px]"
      />
    </div>
  );
};

export default ObjectDetection;

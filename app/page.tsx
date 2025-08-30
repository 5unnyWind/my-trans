"use client";

import { useState } from "react";
import InputCursor from "./InputCursor";

const languages = [
  { value: "English", label: "英文" },
  { value: "Chinese", label: "中文（简体）" },
  { value: "Traditional Chinese", label: "中文（繁体）" },
  { value: "Cantonese", label: "中文（粤语）" },
  { value: "Japanese", label: "日文" },
  { value: "Korean", label: "韩文" },
  { value: "French", label: "法文" },
  { value: "German", label: "德文" },
  { value: "Spanish", label: "西班牙文" },
  { value: "Italian", label: "意大利语" },
  { value: "Icelandic", label: "冰岛语" },
  { value: "Latvian", label: "拉脱维亚语" },
  { value: "Lithuanian", label: "立陶宛语" },
  { value: "Hebrew", label: "希伯来语" },
  { value: "Cebuano", label: "宿务语" },
  { value: "Kannada", label: "卡纳达语" },
  { value: "Kazakh", label: "哈萨克语" },
  { value: "Thai", label: "泰语" },
  { value: "Estonian", label: "爱沙尼亚语" },
  { value: "Khmer", label: "高棉语" },
  { value: "Basque", label: "巴斯克语" },
];


export default function Home() {
  // const response = await fetch("/api/translate", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     content: inputText,
  //     targetLanguage: targetLanguage,
  //   }),
  // });

  return (
    <div className="h-screen bg-background">
      <div className="bg-background h-[60%]">
        <h1 className="text-4xl font-bold">Translate</h1>
      </div>
      <div className="bg-primary h-[40%] rounded-tl-[20vw]  relative">
        {/* 输入区域 */}
        <div className=" px-20 pt-20 pb-4 h-[80%]">
          <InputCursor />
        </div>
      </div>
    </div>
  );
}

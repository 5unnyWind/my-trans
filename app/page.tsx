"use client";

import { useState, useRef, useEffect } from "react";
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
  const [inputText, setInputText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  console.log('cursorPosition', cursorPosition);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateCursorPosition = () => {
    if (!inputRef.current || !containerRef.current) return;

    const input = inputRef.current;
    const computedStyle = window.getComputedStyle(input);
    
    // 创建一个临时的 div 元素来模拟 textarea 的文本布局
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.height = 'auto';
    div.style.width = input.offsetWidth + 'px';
    div.style.fontSize = computedStyle.fontSize;
    div.style.fontFamily = computedStyle.fontFamily;
    div.style.fontWeight = computedStyle.fontWeight;
    div.style.lineHeight = computedStyle.lineHeight;
    div.style.padding = '0px';
    div.style.margin = '0px';
    div.style.border = 'none';
    div.style.boxSizing = 'content-box';
    div.style.whiteSpace = 'pre-wrap';
    div.style.overflowWrap = 'break-word';
    div.style.left = '0px';
    div.style.top = '0px';
    
    document.body.appendChild(div);

    const textBeforeCursor = inputText.substring(0, input.selectionStart || 0);
    
    // 使用文本节点和一个空的 span 标记来标识光标位置
    div.textContent = textBeforeCursor;
    const marker = document.createElement('span');
    marker.style.position = 'relative';
    div.appendChild(marker);
    
    // 获取标记的位置
    const markerRect = marker.getBoundingClientRect();
    const divRect = div.getBoundingClientRect();
    
    const x = markerRect.left - divRect.left;
    const y = markerRect.top - divRect.top;
    
    setCursorPosition({ x, y });

    document.body.removeChild(div);
  };



  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const handleSelectionChange = () => {
        updateCursorPosition();
      };

      input.addEventListener('keyup', handleSelectionChange);
      input.addEventListener('mouseup', handleSelectionChange);

      return () => {
        input.removeEventListener('keyup', handleSelectionChange);
        input.removeEventListener('mouseup', handleSelectionChange);
      };
    }
  }, [inputText]);

  return (
    <div className="h-screen bg-background">
      <div className="bg-background h-[60%] flex items-center justify-center">
        <h1 className="text-4xl font-bold">Translate</h1>
      </div>
      <div className="bg-primary h-[40%] rounded-tl-[20vw] relative">
        {/* 输入区域 */}
        <div className="px-20 pt-20 pb-4 h-[80%]">
          <div ref={containerRef} className="relative w-full h-full">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full bg-transparent border-none outline-none resize-none text-white text-lg font-semibold placeholder-gray-300 caret-transparent"
              style={{ caretColor: 'transparent' }}
            />
            <InputCursor position={cursorPosition} />
          </div>
        </div>
      </div>
    </div>
  );
}

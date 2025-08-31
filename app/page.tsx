"use client";

import { useState, useRef, useEffect } from "react";
import { useRequest } from "ahooks";
import { Textfit } from "react-textfit";
import InputCursor from "./InputCursor";

const languagesOptions = [
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

const generateRandomGlow = () => ({
  width: Math.random() * 160 + 100,
  height: Math.random() * 160 + 100,
  top: Math.random() * 60,
  left: Math.random() * 200 - 50,
  opacity: Math.random() * 0.4 + 0.1,
  rotation: Math.random() * 360,
  borderRadius: `${Math.random() * 30 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 30 + 40}% / ${Math.random() * 30 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 30 + 40}%`
});

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const [glows, setGlows] = useState<{ width: number; height: number; top: number; left: number; opacity: number; rotation: number; borderRadius: string; color: string; visible: boolean }[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: translatedText } = useRequest(
    async () => {
      if (!inputText.trim()) return "";
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          content: inputText,
          targetLanguage: selectedLanguage,
        }),
      });
      return res.json();
    },
    {
      refreshDeps: [inputText, selectedLanguage],
      debounceWait: 300,
    }
  );


  useEffect(() => {
    const newGlows = [
      { ...generateRandomGlow(), color: '#4B3C9E', visible: false },
      { ...generateRandomGlow(), color: '#190E9A', visible: false }
    ];

    setGlows(newGlows);

    // 延迟显示光晕
    setTimeout(() => {
      setGlows(prev => prev.map(glow => ({ ...glow, visible: true })));
    }, 100);
  }, []);

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
      {/* 翻译后文本 */}
      <div className="bg-background h-[60%] flex items-center justify-center px-8">
        <div className="w-full h-full max-h-[80%] overflow-auto">
          <Textfit
            mode="multi"
            min={16}
            max={32}
            className="w-full h-full flex items-center justify-center font-bold text-center"
          >
            {translatedText || 'Translate'}
          </Textfit>
        </div>
      </div>

      <div className="bg-primary/80 h-[40%] rounded-tl-[14rem] relative overflow-hidden backdrop-blur-sm border-t border-l border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%)',
          backdropFilter: 'blur(10px)'
        }}>
        {/* 光晕 */}
        {glows.map((glow, index) => (
          <div key={index} className="absolute blur-3xl transition-opacity duration-1000 ease-in-out" style={{
            top: `${glow.top}%`,
            left: `${glow.left}%`,
            width: `${glow.width}px`,
            height: `${glow.height}px`,
            opacity: glow.visible ? glow.opacity : 0,
            background: glow.color,
            boxShadow: `0 0 60px 30px ${glow.color}, 0 0 120px 60px ${glow.color}40`,
            borderRadius: glow.borderRadius,
            transform: `rotate(${glow.rotation}deg)`
          }} />
        ))}

        {/* 输入区域 */}
        <div className="px-20 pt-20 pb-4 h-[80%]">
          <div ref={containerRef} className="relative w-full h-full">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground text-lg font-semibold placeholder-gray-300 caret-transparent"
              style={{ caretColor: 'transparent' }}
            />
            <InputCursor position={cursorPosition} />
          </div>
        </div>

        {/* 目标语言选择 */}
        <div className='relative flex items-center w-full overflow-x-auto  pr-20 h-full'>
          {languagesOptions.map((language, index) => {
            const colors = ['#FFFFFF', '#FFFEC4', '#B8FFA5', '#53BDA7', '#509BEB', '#C4EFFE', '#65C3FC', '#7CEFDF', '#72FEAE', '#44D77D', '#37BE8E', '#45B3B0', '#FFF6FF'];
            const colorIndex = index % colors.length;
            const nextColorIndex = (index + 1) % colors.length;
            const isSelected = selectedLanguage === language.value;
            return (
              <div
                key={language.value}
                onClick={() => setSelectedLanguage(language.value)}
                className={`${isSelected ? 'mt-0' : 'mt-9'} h-full shrink-0 rounded-t-2xl px-4 py-2 text-black font-semibold backdrop-blur-sm border shadow-lg cursor-pointer transition-all duration-300 ${isSelected ? 'border-white/60' : 'border-white/30'}`}
                style={{
                  background: `linear-gradient(135deg, ${colors[colorIndex]}${isSelected ? 'FF' : '80'}, ${colors[nextColorIndex]}${isSelected ? 'FF' : '80'})`,
                  backdropFilter: 'blur(10px)'
                }}>
                {language.label}
              </div>
            );
          })}
        </div>
        {/* 提交 */}
        {/* <div className="absolute right-2 bottom-2">
          <button className="bg-white text-black px-4 py-2 rounded-full">⬆️</button>
        </div> */}
      </div>
    </div>
  );
}

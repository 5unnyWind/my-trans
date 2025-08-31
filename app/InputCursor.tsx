interface InputCursorProps {
  position: { x: number; y: number };
}

export default function InputCursor({ position }: InputCursorProps) {
    return (
        <svg 
            className="icon animate-pulse absolute pointer-events-none" 
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22"
            style={{
                transform: 'translateY(-0.5px) translateX(-6px)',
                left: position.x,
                top: position.y,
                animation: 'blink 1s infinite',
            }}
        >
            <path 
                d="M260.766953 0m69.818182 0l0 0q69.818182 0 69.818181 69.818182l0 884.363636q0 69.818182-69.818181 69.818182l0 0q-69.818182 0-69.818182-69.818182l0-884.363636q0-69.818182 69.818182-69.818182Z" 
                className="fill-foreground" 
            />
            <style jsx>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.1; }
                    100% { opacity: 1; }
                }
            `}</style>
        </svg>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Highlight, themes } from "prism-react-renderer";

interface CodeProps {
  placeholder?: string;
  initialValue?: string;
}

export default function Code({
  placeholder = "Add some code here...",
  initialValue = "",
}: CodeProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>(initialValue);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState<boolean>(false);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && preRef.current && textAreaRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const preHeight = preRef.current.clientHeight;

      textAreaRef.current.style.height = `${Math.max(
        containerHeight,
        preHeight
      )}px`;
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center  p-4">
      <div
        className={clsx(
          isTextAreaFocused ? "border-pink-400" : "border-white/20",
          "w-full max-w-5xl h-[80vh] rounded-xl border-[1px] py-4",
          "transition-colors duration-300 ease-in-out"
        )}
      >
        <div
          ref={containerRef}
          className="relative h-full w-full overflow-auto"
        >
          <Highlight theme={themes.nightOwl} code={value} language="jsx">
            {({ className, tokens, getLineProps, getTokenProps }) => (
              <>
                <textarea
                  ref={textAreaRef}
                  value={value}
                  placeholder={placeholder}
                  onChange={handleChange}
                  spellCheck={false}
                  onFocus={() => setIsTextAreaFocused(true)}
                  onBlur={() => setIsTextAreaFocused(false)}
                  className={clsx(
                    className,
                    "absolute w-full h-full resize-none overflow-hidden whitespace-pre-wrap break-words break-keep bg-transparent pl-16 pr-3 font-mono text-transparent",
                    "caret-pink-500 selection:bg-pink-500/30 placeholder:text-white/20 focus:outline-none"
                  )}
                />
                <pre
                  ref={preRef}
                  aria-hidden={true}
                  className={clsx(
                    className,
                    "pointer-events-none absolute w-full h-full select-none pr-3"
                  )}
                >
                  {tokens.map((line, i) => (
                    <div
                      key={i}
                      {...getLineProps({ line, key: i })}
                      className="table-row"
                    >
                      <span className="table-cell w-10 select-none text-right opacity-50 pr-4">
                        {i + 1}
                      </span>
                      <code className="table-cell whitespace-pre-wrap break-words break-keep">
                        {line.map((token, key) => {
                          const tokenProps = getTokenProps({ token, key });
                          return <span key={key} {...tokenProps} />;
                        })}
                      </code>
                    </div>
                  ))}
                </pre>
              </>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
}

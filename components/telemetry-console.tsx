"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, Trash2, Cpu, Radio, Battery, Compass } from "lucide-react";
import { createTelemetrySession, CommandExecutionResult } from "@/data/telemetry-commands";

interface HistoryRecord {
  input: string;
  output: string[];
  status: "success" | "error" | "cleared";
}

const QUICK_COMMANDS = [
  "help",
  "telemetry",
  "arm test",
  "subsystems",
  "science",
  "rovers",
  "clear",
];

export function TelemetryConsole() {
  const [{ session, initialRecord }] = useState(() => {
    const telemetrySession = createTelemetrySession();
    const initial = telemetrySession.execute("telemetry");
    return {
      session: telemetrySession,
      initialRecord: {
        input: "telemetry",
        output: initial.output,
        status: initial.status,
      } as HistoryRecord,
    };
  });
  const [history, setHistory] = useState<HistoryRecord[]>([initialRecord]);
  const [inputVal, setInputVal] = useState<string>("");
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (rawCommand: string) => {
    const commandText = rawCommand.trim();
    if (!commandText) {
      setInputVal("");
      return;
    }

    const res: CommandExecutionResult = session.execute(commandText);
    if (res.status === "cleared") {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        { input: commandText, output: res.output, status: res.status },
      ]);
    }
    setInputVal("");
    setHistoryPointer(-1);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextPtr = historyPointer + 1;
      const cmd = session.getPreviousCommand(nextPtr);
      if (cmd !== null) {
        setHistoryPointer(nextPtr);
        setInputVal(cmd);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPtr = historyPointer - 1;
        const cmd = session.getPreviousCommand(nextPtr);
        if (cmd !== null) {
          setHistoryPointer(nextPtr);
          setInputVal(cmd);
        }
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInputVal("");
      }
    }
  };

  return (
    <section
      id="telemetry"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-canvas border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header + Quick Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase">
                {"// 5.8 GHZ TELEMETRY BRIDGE"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              Matrix Telemetry Console
            </h2>
            <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Query live rover avionics, execute 6-DOF manipulator self-tests, and verify subsystem readiness through the interactive monospace CLI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-surface border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Radio className="h-4 w-4 text-accent-cyan shrink-0" />
              <div className="font-mono">
                <span className="text-zinc-500 block text-[10px]">RF LINK</span>
                <span className="text-white text-xs font-bold">5.8 GHz</span>
              </div>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Battery className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="font-mono">
                <span className="text-zinc-500 block text-[10px]">POWER BUS</span>
                <span className="text-white text-xs font-bold">24.8V</span>
              </div>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Cpu className="h-4 w-4 text-accent-purple shrink-0" />
              <div className="font-mono">
                <span className="text-zinc-500 block text-[10px]">JETSON ORIN</span>
                <span className="text-white text-xs font-bold">42.5°C</span>
              </div>
            </div>
            <div className="bg-surface border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-accent-yellow shrink-0" />
              <div className="font-mono">
                <span className="text-zinc-500 block text-[10px]">GPS FIX</span>
                <span className="text-white text-xs font-bold">MDRS Utah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monospace CLI Terminal */}
        <div
          data-testid="telemetry-terminal"
          onClick={() => inputRef.current?.focus()}
          className="rounded-xl border border-white/10 bg-canvas shadow-2xl overflow-hidden flex flex-col h-[500px]"
        >
          {/* Terminal Top Bar */}
          <div className="h-10 bg-surface border-b border-white/10 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent-yellow" />
              <span className="font-mono text-xs font-semibold text-white">
                matrix@itu-rover:~$
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHistory([]);
                setHistoryPointer(-1);
              }}
              className="text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Clear screen buffer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          {/* Scrollable Output Buffer */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 font-mono text-xs sm:text-sm text-zinc-300 overflow-y-auto space-y-3 bg-canvas"
          >
            <div className="text-zinc-500 text-xs pb-2 border-b border-white/5">
              <span>ITU Matrix Autonomous Telemetry Terminal [Build 2026.1]</span>
              <br />
              <span>
                Type <span className="text-accent-yellow font-bold">help</span> to view commands, or select a quick action below.
              </span>
            </div>

            {history.map((record, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-accent-yellow font-bold">
                    matrix@itu-rover
                  </span>
                  <span className="text-zinc-500">:</span>
                  <span className="text-accent-cyan">~</span>
                  <span className="text-zinc-400">$</span>
                  <span className="text-white font-semibold">{record.input}</span>
                </div>
                <div className="pl-3 sm:pl-4 space-y-0.5">
                  {record.output.map((line, lineIdx) => {
                    const isError = record.status === "error";
                    const isOk =
                      line.startsWith("[OK]") ||
                      line.includes("[PASS]") ||
                      line.includes("NOMINAL");
                    return (
                      <div
                        key={lineIdx}
                        className={`text-xs leading-relaxed break-words ${
                          isError
                            ? "text-red-400"
                            : isOk
                            ? "text-emerald-400"
                            : "text-zinc-300"
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Command Chips */}
          <div className="px-4 py-2 bg-surface/60 border-t border-white/5 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Commands:
            </span>
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  executeCommand(cmd);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent-yellow border border-white/10 font-mono text-xs transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Interactive CLI Form */}
          <form
            onSubmit={handleCommandSubmit}
            className="h-12 bg-surface border-t border-white/10 px-4 flex items-center gap-3"
          >
            <div className="flex items-center gap-1 font-mono text-xs select-none shrink-0">
              <span className="text-accent-yellow font-bold">
                matrix<span className="hidden sm:inline">@itu-rover</span>
              </span>
              <span className="text-zinc-500">:</span>
              <span className="text-accent-cyan">~</span>
              <span className="text-zinc-400">$</span>
            </div>
            <input
              ref={inputRef}
              data-testid="console-input"
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setHistoryPointer(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type command (telemetry, arm test, subsystems, help)..."
              className="flex-1 min-w-0 bg-transparent font-mono text-xs sm:text-sm text-white focus:outline-none placeholder:text-zinc-600"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-accent-yellow/10 hover:bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 font-mono text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="h-3 w-3" />
              <span className="hidden sm:inline">Run</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

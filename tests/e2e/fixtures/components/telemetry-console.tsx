"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, Trash2 } from "lucide-react";
import { createTelemetrySession, TelemetrySession } from "@/tests/e2e/helpers/telemetry-runner";

export function TelemetryConsole() {
  const [session] = useState<TelemetrySession>(() => createTelemetrySession());
  const [inputVal, setInputVal] = useState("");
  const [historyLogs, setHistoryLogs] = useState<Array<{ text: string; isCmd?: boolean }>>([
    { text: "ITU MATRIX TELEMETRY CONSOLE v2.6 [ONLINE 5.8GHz]" },
    { text: "Type 'help' for command directory, 'telemetry' for real-time telemetry." },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const res = session.execute(cmd);
    if (res.status === "cleared") {
      setHistoryLogs([]);
    } else {
      setHistoryLogs((prev) => [
        ...prev,
        { text: `matrix@itu-rover:~$ ${cmd}`, isCmd: true },
        ...res.output.map((line) => ({ text: line })),
      ]);
    }
    setInputVal("");
  };

  return (
    <div
      data-testid="telemetry-terminal"
      id="telemetry"
      className="w-full rounded-xl bg-canvas border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col font-mono text-xs"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-white/10">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Terminal className="w-4 h-4 text-accent-yellow" />
          <span className="font-semibold text-zinc-200">
            matrix@itu-rover: /dev/telemetry
          </span>
        </div>
        <button
          onClick={() => {
            session.execute("clear");
            setHistoryLogs([]);
          }}
          className="text-zinc-500 hover:text-zinc-300"
          title="Clear screen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Output Console Buffer */}
      <div className="p-4 flex-1 min-h-[220px] max-h-[280px] overflow-y-auto space-y-1 text-zinc-300 bg-canvas/90">
        {historyLogs.map((log, idx) => (
          <div
            key={idx}
            className={
              log.isCmd
                ? "text-accent-yellow font-semibold"
                : log.text.includes("[PASS]") || log.text.includes("[OK]")
                ? "text-emerald-400"
                : log.text.includes("Command not recognized")
                ? "text-rose-400"
                : "text-zinc-300"
            }
          >
            {log.text}
          </div>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center px-3 py-2 bg-surface/50 border-t border-white/10"
      >
        <span className="text-accent-yellow mr-2 select-none">$</span>
        <input
          data-testid="console-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="help, telemetry, arm test, subsystems, clear..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-zinc-600"
        />
        <button type="submit" className="text-zinc-400 hover:text-accent-yellow p-1">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

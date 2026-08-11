import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { Project } from "../types";

interface SpaceLockGateProps {
  space: Project;
  onUnlock: () => void;
}

// Light-weight client-side passcode gate for a space. This is a convenience
// lock, not real security: the passcode lives in the shared workspace data, so
// treat it as "keep casual visitors out", not as protection for secrets.
export default function SpaceLockGate({ space, onUnlock }: SpaceLockGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === (space.password || "")) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0F1115]">
      <form
        onSubmit={submit}
        id="space-lock-gate"
        className="w-full max-w-sm bg-white dark:bg-[#14171C] border border-slate-200 dark:border-[#1E222B] rounded-2xl shadow-xl p-7 flex flex-col items-center text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{space.name}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          This space is protected. Enter the passcode to continue.
        </p>

        <input
          id="space-lock-input"
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Passcode"
          className={`w-full text-center bg-slate-50 dark:bg-[#0F1115] border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-500 focus:ring-rose-500/40"
              : "border-slate-200 dark:border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500"
          }`}
        />
        {error && (
          <p className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 mt-2">
            Incorrect passcode. Try again.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg px-4 py-2.5 cursor-pointer shadow-sm"
        >
          <ShieldCheck className="w-4 h-4" />
          Unlock space
        </button>
      </form>
    </div>
  );
}

"use client";

export default function PageError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto min-h-[45vh] max-w-6xl px-6 pb-24 pt-32">
      <h1 className="font-display text-3xl text-[#f4f5ef]">This page couldn’t load</h1>
      <button type="button" onClick={reset} className="focus-ring mt-6 rounded-md bg-[#b2edcb] px-4 py-2 font-semibold text-[#0a1113]">Try again</button>
    </section>
  );
}

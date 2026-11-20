"use client";

import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiPlay, FiRotateCcw, FiX } from "react-icons/fi";
import { demoTasks, type DemoTask } from "@/lib/devPilotDemo";

const steps = [
  { id: "issue", title: "Issue" },
  { id: "inspect", title: "Inspect" },
  { id: "diff", title: "Code diff" },
  { id: "tests", title: "Tests" },
  { id: "review", title: "Review" },
] as const;

const control = "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm text-[#e6eeea] transition-colors hover:border-[#b2edcb] disabled:opacity-40";
const primary = "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#b2edcb] px-3 py-2 text-sm font-bold text-[#0a1611] transition-colors hover:bg-[#d1f9e3] disabled:opacity-40";

export default function AgentReplay() {
  const [selected, setSelected] = useState(0);
  return <Workflow key={selected} task={demoTasks[selected]} selected={selected} onSelect={setSelected} />;
}

function Workflow({ task, selected, onSelect }: { task: DemoTask; selected: number; onSelect: (index: number) => void }) {
  const [index, setIndex] = useState(0);
  const [revision, setRevision] = useState(0);
  const patch = task.revisions[revision];
  const [view, setView] = useState<"unified" | "split">("unified");
  const [results, setResults] = useState<ReturnType<DemoTask["run"]> | null>(null);
  const [review, setReview] = useState<"approved" | "changes" | null>(null);
  const step = steps[index];
  const allPassed = !!results?.every((result) => result.afterPassed);
  const historicalFailed = results?.filter((result) => !result.beforePassed).length ?? 0;

  function reset() {
    setIndex(0);
    setRevision(0);
    setView("unified");
    setResults(null);
    setReview(null);
  }

  return (
    <section id="devpilot-demo" aria-labelledby="devpilot-workflow" className="scroll-mt-20 overflow-hidden rounded-2xl border border-white/15 bg-[#101a1d]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#b2edcb]">Interactive sample workflow</p>
          <h2 id="devpilot-workflow" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{task.name}</h2>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-xs text-[#bdcbc5]">Sample task
            <select value={selected} onChange={(event) => onSelect(Number(event.target.value))} className={`${control} bg-[#0a1113]`}>
              {demoTasks.map((candidate, position) => <option value={position} key={candidate.id}>{candidate.name}</option>)}
            </select>
          </label>
          <button type="button" onClick={reset} className={control}><FiRotateCcw aria-hidden="true" /> Reset demo</button>
        </div>
      </header>
      <div className="grid lg:grid-cols-[12.5rem_minmax(0,1fr)]">
        <nav aria-label="Workflow stages" className="flex flex-wrap gap-1 border-b border-white/10 p-3 lg:flex-col lg:border-b-0 lg:border-r">
          {steps.map(({ id, title }, position) => (
            <button
              type="button"
              key={id}
              aria-current={position === index ? "step" : undefined}
              className="focus-ring rounded-md px-3 py-2.5 text-left text-sm text-[#ccd9d3] hover:bg-white/5 aria-[current=step]:bg-[#214237] aria-[current=step]:text-[#d5ffea]"
              onClick={() => setIndex(position)}
            >
              <span aria-hidden="true" className="mr-2 font-mono text-xs text-[#b2edcb]">0{position + 1}</span>{title}
            </button>
          ))}
        </nav>
        <div className="flex min-h-[21rem] min-w-0 flex-col p-5 sm:p-7">
          <div className="flex-1">
            {step.id === "issue" && (
              <>
                <h3 className="font-display text-2xl font-semibold">{task.issue}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-[#bfcec9]">{task.description}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-[#0a1113] p-4"><dt className="text-sm text-[#bdcbc5]">Expected output</dt><dd className="mt-2 break-words font-mono text-[#b2edcb]">{task.expected}</dd></div>
                  <div className="rounded-lg border border-white/10 bg-[#0a1113] p-4"><dt className="text-sm text-[#bdcbc5]">Current output</dt><dd className="mt-2 break-words font-mono text-[#ffc0b7]">{task.actual}</dd></div>
                </dl>
              </>
            )}

            {step.id === "inspect" && (
              <>
                <h3 className="font-display text-2xl font-semibold">Inspect the source</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-[#bfcec9]">{task.diagnosis}</p>
                <div className="mt-6 rounded-lg border border-white/10 bg-[#0a1113] px-4 py-4 font-mono text-xs sm:text-sm">
                  <p className="mb-3 text-[#a5bbb0]">{task.path}</p>
                  <pre className="overflow-auto" data-lenis-prevent><code>{`${task.signature} {\n${task.before}\n}`}</code></pre>
                </div>
                <p className="mt-3 font-mono text-xs text-[#a5bbb0]">Regression suite · {task.testsPath}</p>
              </>
            )}

            {step.id === "diff" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold">Review the patch</h3>
                  <div role="group" aria-label="Diff view" className="portfolio-switch">
                    {(["unified", "split"] as const).map((mode) => (
                      <button type="button" key={mode} className="focus-ring" aria-pressed={view === mode} onClick={() => setView(mode)}>{mode}</button>
                    ))}
                  </div>
                </div>
                <div role="group" aria-label="Patch history" className="mt-5 flex flex-wrap gap-2">
                  {task.revisions.map(({ name }, position) => (
                    <button key={name} type="button" className={`${control} aria-pressed:border-[#b2edcb] aria-pressed:bg-[#214237]`} aria-pressed={position === revision} onClick={() => {
                      if (position === revision) return;
                      setRevision(position);
                      setResults(null);
                      setReview(null);
                    }}>{name}</button>
                  ))}
                </div>
                <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#0a1113]">
                  <p className="border-b border-white/10 px-4 py-3 font-mono text-xs text-[#c4d2cd]">{task.path}</p>
                  <div className={view === "split" ? "grid gap-px bg-white/10 sm:grid-cols-2" : ""}>
                    <DiffLine kind="Removed" line={revision ? task.revisions[revision - 1].line : task.before} />
                    <DiffLine kind="Added" line={patch.line} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#bfcec9]">{patch.reason}</p>
              </>
            )}

            {step.id === "tests" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold">Run the regression suite</h3>
                  <button type="button" className={primary} onClick={() => { setResults(task.run(revision)); setReview(null); }}><FiPlay aria-hidden="true" /> Run tests</button>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#bfcec9]">{patch.name} runs against the same inputs as the original.</p>
                {results && (
                  <div className="mt-5">
                    <p role="status" className="font-mono text-xs text-[#b2edcb]">Original: {historicalFailed} failed · Patched: {results.filter((result) => result.afterPassed).length}/{results.length} passed</p>
                    <div className="mt-3 divide-y divide-white/10 rounded-lg border border-white/15">
                      {results.map((result) => (
                        <details key={result.name} className="px-3 py-2">
                          <summary className="focus-ring cursor-pointer rounded text-sm leading-relaxed">
                            {result.name} <span className={result.afterPassed ? "text-[#b2edcb]" : "text-[#ffc0b7]"}>· {result.afterPassed ? "Pass" : "Fail"}</span>
                          </summary>
                          <dl className="mt-2 grid gap-1 break-words font-mono text-xs text-[#bfcec9]">
                            <div><dt className="inline">Input: </dt><dd className="inline">{result.input}</dd></div>
                            <div><dt className="inline">Expected: </dt><dd className="inline">{result.expected}</dd></div>
                            <div><dt className="inline">Original: </dt><dd className="inline">{result.before}</dd></div>
                            <div><dt className="inline">Patched: </dt><dd className="inline">{result.after}</dd></div>
                          </dl>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {step.id === "review" && (
              <>
                <h3 className="font-display text-2xl font-semibold">Review the sample patch</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-[#bfcec9]">Your decision applies to this sample task in your browser.</p>
                <p role="status" className="mt-5 font-mono text-xs text-[#b2edcb]">
                  {review === "approved" ? "Patch approved" : review === "changes" ? "Changes requested" : allPassed ? "Ready for review · all patched tests passed" : results ? "This revision has failing tests. Review the output and try the next patch." : "Run the regression suite to enable approval."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" className={primary} disabled={!allPassed || review === "approved"} onClick={() => setReview("approved")}><FiCheck aria-hidden="true" /> Approve sample patch</button>
                  <button type="button" className={control} disabled={review === "changes"} onClick={() => setReview("changes")}><FiX aria-hidden="true" /> Request changes</button>
                </div>
              </>
            )}
          </div>

          <div className="mt-7 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4">
            <button type="button" className={control} disabled={index === 0} onClick={() => setIndex(index - 1)}><FiArrowLeft aria-hidden="true" /> Previous</button>
            {index < steps.length - 1 && (
              <button type="button" className={control} onClick={() => setIndex(index + 1)}>Next step <FiArrowRight aria-hidden="true" /></button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiffLine({ kind, line }: { kind: "Removed" | "Added"; line: string }) {
  const added = kind === "Added";
  return (
    <div className={added ? "min-w-0 bg-[#142d24] text-[#b2edcb]" : "min-w-0 bg-[#341f24] text-[#ffc0b7]"}>
      <p className="px-4 pt-2 text-xs">{kind}</p>
      <pre className="overflow-auto px-4 pb-3 pt-1 font-mono text-[11px] sm:text-xs" data-lenis-prevent><code>{added ? "+" : "−"}{line}</code></pre>
    </div>
  );
}

import { pipelineStages } from "@/lib/vegetationData";

export default function InferencePipeline() {
  return (
    <ol aria-label="Canopy-height estimation workflow" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {pipelineStages.map((stage, index) => (
        <li key={stage.id} className="flex gap-3 rounded-lg border border-white/15 bg-[#101a1d] p-4">
          <span aria-hidden="true" className="pt-0.5 font-mono text-xs text-[#b2edcb]">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-display text-sm font-semibold">{stage.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#b4c4bf]">{stage.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

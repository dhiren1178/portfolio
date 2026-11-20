import type { Metadata } from "next";
import { CaseLayout } from "@/components/portfolio/Editorial";
import AgentReplay from "@/components/projects/AgentReplay";

export const metadata: Metadata = {
  title: "DevPilot AI — Dhiren Sharma",
  description: "Follow an example issue from triage to a patch, regression tests and human review.",
};

export default function DevPilotPage() {
  return (
    <CaseLayout
      kind="devpilot"
      title="DevPilot AI"
      label="Agentic AI · Software engineering"
      summary="I built a workflow that turns GitHub issues into proposed patches with test results a human reviewer can inspect."
      role="I designed the LangGraph workflow, built the dashboard for inspecting decisions and failures, and added an approval step before pull request submission."
      method="The workflow investigates an issue, proposes a patch and runs tests in an isolated Docker environment. If checks fail, the workflow uses the failure details to revise the patch."
      evaluation="In the original 30-task evaluation, iterative patch refinement increased resolved tasks from 17 to 22."
      metrics={[
        { label: "Initial workflow", value: "17 / 30" },
        { label: "With patch refinement", value: "22 / 30" },
        { label: "Resolution after refinement", value: "73%" },
      ]}
      limitation="The evaluation covered 30 tasks. The portfolio replay uses two bundled examples and runs their regression checks in the browser. It illustrates how a failed test informs the next revision."
    >
      <AgentReplay />
    </CaseLayout>
  );
}

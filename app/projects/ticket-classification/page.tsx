import type { Metadata } from "next";
import { CaseLayout } from "@/components/portfolio/Editorial";

export const metadata: Metadata = {
  title: "Intelligent Ticket Routing — Dhiren Sharma",
  description: "Support-ticket classification and confidence-aware routing at Vegayan Systems.",
};

export default function TicketClassificationPage() {
  return (
    <CaseLayout
      kind="tickets"
      title="Intelligent ticket routing"
      label="Production ML · Vegayan Systems"
      summary="I built a classifier to assign Freshdesk support tickets and hand uncertain cases back to the support team."
      role="As a machine learning engineer, I engineered over 20 features, compared classification models and helped deploy the inference service."
      method="I compared logistic regression, random forest and XGBoost, then used SMOTE and tuning to improve macro-F1. The service used FastAPI and Docker on AWS with a 75% confidence threshold for automatic routing."
      evaluation="Macro-F1 summarizes performance across ticket categories. Tuning improved the score from 0.71 to 0.80. The deployed workflow reduced assignment time by a reported 66%."
      metrics={[
        { label: "Baseline macro-F1", value: "0.71" },
        { label: "Tuned macro-F1", value: "0.80" },
        { label: "Reduction in assignment time", value: "66%" },
      ]}
      limitation="Tickets below the confidence threshold went to manual review. Changes in ticket categories or language can affect model performance and the share of tickets that require review."
    />
  );
}

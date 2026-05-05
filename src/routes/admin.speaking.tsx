import { createFileRoute } from "@tanstack/react-router";
import { SpeakingTopicsEditor } from "@/components/admin/SpeakingTopicsEditor";

export const Route = createFileRoute("/admin/speaking")({
  component: SpeakingTopicsEditor,
});

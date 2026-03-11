import Navbar from "@/components/Navbar";
import { FileText, PenLine } from "lucide-react";

const AssessmentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Patient Risk Assessment</h1>
        <p className="mt-2 text-muted-foreground">
          Choose how you'd like to enter clinical data.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Upload Card */}
          <button className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Upload Medical Report</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a PDF or image-based post-operative report. AI will extract clinical values and pre-fill the form.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Supports PDF, JPEG, PNG</p>
          </button>

          {/* Manual Entry Card */}
          <button className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <PenLine className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Manual Data Entry</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter all clinical data manually using the step-by-step assessment form.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">7 assessment steps</p>
          </button>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <p><strong>Disclaimer:</strong> For demonstration purposes only. Not a medical diagnosis tool.</p>
          <p>Built using AI &amp; Machine Learning concepts</p>
        </footer>
      </div>
    </div>
  );
};

export default AssessmentPage;

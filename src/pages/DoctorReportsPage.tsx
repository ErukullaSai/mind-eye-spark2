import Navbar from "@/components/Navbar";
import { FileText, Search, Calendar, ChevronDown, ChevronUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const riskBadgeVariant = (level: string) => {
  if (level === "High" || level === "Critical") return "destructive" as const;
  if (level === "Low") return "secondary" as const;
  return "outline" as const;
};

const DoctorReportsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [patients, setPatients] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: assessData }, { data: patientData }] = await Promise.all([
        supabase.from("assessments").select("*").eq("doctor_id", user.id).order("created_at", { ascending: false }),
        supabase.from("patients").select("*").eq("doctor_id", user.id),
      ]);
      setAssessments(assessData || []);
      const pMap: Record<string, any> = {};
      (patientData || []).forEach((p: any) => { pMap[p.id] = p; });
      setPatients(pMap);
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered = assessments.filter(
    (a) =>
      (a.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">My Assessment Reports</h1>
        <p className="mt-2 text-muted-foreground">Click on a patient name to view full details and assessment data.</p>

        <div className="mt-8 relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by patient name..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No reports yet</h3>
            <p className="mt-2 text-muted-foreground">Complete patient assessments to see reports here.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((a) => {
              const isExpanded = expandedId === a.id;
              const ad = a.assessment_data as any;
              const patient = a.patient_id ? patients[a.patient_id] : null;

              return (
                <div key={a.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all">
                  {/* Header row - clickable */}
                  <button
                    onClick={() => toggleExpand(a.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{a.patient_name || "Unknown Patient"}</span>
                          <Badge variant={riskBadgeVariant(a.risk_level)}>{a.risk_level} Risk — {a.risk_score}%</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3 inline" /> {new Date(a.created_at).toLocaleDateString()}</span>
                          {a.surgery_type && <> · Surgery: <strong>{a.surgery_type}</strong></>}
                          {" · "}{a.status}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-border p-5 space-y-5 bg-muted/10">
                      {/* Patient basic info */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />Patient Information
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="rounded-lg border border-border bg-card p-3">
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="text-sm font-medium text-foreground">{a.patient_name || ad?.fullName || "—"}</p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-3">
                            <p className="text-xs text-muted-foreground">Age</p>
                            <p className="text-sm font-medium text-foreground">{ad?.age || patient?.age || "—"}</p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-3">
                            <p className="text-xs text-muted-foreground">Gender</p>
                            <p className="text-sm font-medium text-foreground">{ad?.gender || patient?.gender || "—"}</p>
                          </div>
                          <div className="rounded-lg border border-border bg-card p-3">
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium text-foreground">{ad?.contactNumber || patient?.contact_number || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Surgery info */}
                      {ad && (ad.surgeryType || ad.surgeonName || ad.eyeSide) && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Surgery Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {ad.surgeryType && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Type</p><p className="text-sm font-medium text-foreground">{ad.surgeryType}</p></div>}
                            {ad.surgeonName && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Surgeon</p><p className="text-sm font-medium text-foreground">{ad.surgeonName}</p></div>}
                            {ad.eyeSide && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Eye</p><p className="text-sm font-medium text-foreground">{ad.eyeSide}</p></div>}
                            {ad.anesthesiaType && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Anesthesia</p><p className="text-sm font-medium text-foreground">{ad.anesthesiaType}</p></div>}
                            {ad.surgeryDate && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Surgery Date</p><p className="text-sm font-medium text-foreground">{ad.surgeryDate}</p></div>}
                          </div>
                        </div>
                      )}

                      {/* Medical history */}
                      {ad && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Medical History</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Diabetes</p><p className="text-sm font-medium text-foreground">{ad.diabetes || "None"}</p></div>
                            <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Hypertension</p><p className="text-sm font-medium text-foreground">{ad.hypertension ? "Yes" : "No"}</p></div>
                            <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Immunocompromised</p><p className="text-sm font-medium text-foreground">{ad.immunocompromised ? "Yes" : "No"}</p></div>
                            <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Previous Eye Surgery</p><p className="text-sm font-medium text-foreground">{ad.previousEyeSurgery ? "Yes" : "No"}</p></div>
                          </div>
                        </div>
                      )}

                      {/* Clinical measurements */}
                      {ad && (ad.preVisualAcuity || ad.postVisualAcuity || ad.intraocularPressure || ad.postIntraocularPressure) && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Clinical Measurements</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {ad.preVisualAcuity && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Pre-op VA</p><p className="text-sm font-medium text-foreground">{ad.preVisualAcuity}</p></div>}
                            {ad.postVisualAcuity && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Post-op VA</p><p className="text-sm font-medium text-foreground">{ad.postVisualAcuity}</p></div>}
                            {ad.intraocularPressure && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Pre-op IOP</p><p className="text-sm font-medium text-foreground">{ad.intraocularPressure} mmHg</p></div>}
                            {ad.postIntraocularPressure && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Post-op IOP</p><p className="text-sm font-medium text-foreground">{ad.postIntraocularPressure} mmHg</p></div>}
                            {ad.cornealEdema && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Corneal Edema</p><p className="text-sm font-medium text-foreground">{ad.cornealEdema}</p></div>}
                            {ad.anteriorChamberReaction && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">AC Reaction</p><p className="text-sm font-medium text-foreground">{ad.anteriorChamberReaction}</p></div>}
                            {ad.woundIntegrity && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Wound Integrity</p><p className="text-sm font-medium text-foreground">{ad.woundIntegrity}</p></div>}
                            {ad.painLevel && <div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Pain Level</p><p className="text-sm font-medium text-foreground">{ad.painLevel}/10</p></div>}
                          </div>
                        </div>
                      )}

                      {/* Symptoms */}
                      {ad && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {ad.blurredVision && <Badge variant="outline">Blurred Vision</Badge>}
                            {ad.eyePain && <Badge variant="outline">Eye Pain</Badge>}
                            {ad.redness && <Badge variant="outline">Redness</Badge>}
                            {ad.discharge && <Badge variant="outline">Discharge</Badge>}
                            {ad.photophobia && <Badge variant="outline">Photophobia</Badge>}
                            {ad.floaters && <Badge variant="outline">Floaters</Badge>}
                            {!ad.blurredVision && !ad.eyePain && !ad.redness && !ad.discharge && !ad.photophobia && !ad.floaters && (
                              <span className="text-sm text-muted-foreground">No symptoms reported</span>
                            )}
                          </div>
                          {ad.additionalSymptoms && (
                            <p className="mt-2 text-sm text-muted-foreground">Additional: {ad.additionalSymptoms}</p>
                          )}
                        </div>
                      )}

                      {/* Clinician notes */}
                      {ad?.clinicianNotes && (
                        <div className="rounded-lg border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground mb-1">Clinician Notes</p>
                          <p className="text-sm text-foreground">{ad.clinicianNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReportsPage;

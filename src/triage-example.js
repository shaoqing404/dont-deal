import { classifyFastTriage } from "./triage-engine.js";

const result = classifyFastTriage(
  {
    subject_role: "self",
    symptoms_active_now: true,
    chest_discomfort: true,
    chest_pressure_or_tightness: true,
    pain_duration_minutes: 20,
    pain_started_at_rest: true,
    getting_worse: true,
    shortness_of_breath: true,
    sweating: true,
    nausea_or_vomiting: false,
    dizziness_or_faintness: false,
    radiation_sites: ["back", "jaw"],
    jaw_or_tooth_pain: true,
    pain_worse_with_pressing_on_chest: false,
    pain_worse_with_breathing_or_movement: false,
    recurrent_with_exertion: false,
    known_angina_pattern_changed: false,
    hypertension: true,
    diabetes: false,
    smoking: false,
    high_cholesterol: true,
    family_history_early_heart_disease: false,
    age_risk: true,
    prior_heart_disease: false
  },
  {
    snapshot: {
      overall_fatigue: "high"
    }
  }
);

process.stdout.write(JSON.stringify(result, null, 2) + "\n");

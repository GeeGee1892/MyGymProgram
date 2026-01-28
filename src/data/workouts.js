// Workout templates using exercise IDs from exercises.js
export const workoutTemplates = {
  push: [
    { id: 'chest_press_incline', sets: 3, reps: '8-10' },
    { id: 'chest_press_flat_bb', sets: 3, reps: '6-8' },
    { id: 'chest_fly_cable', sets: 3, reps: '12-15' },
    { id: 'shoulder_press_db', sets: 3, reps: '8-10' },
    { id: 'lateral_raise_db', sets: 3, reps: '12-15' },
    { id: 'tricep_pushdown_rope', sets: 3, reps: '10-12' },
    { id: 'tricep_overhead_cable', sets: 2, reps: '10-12' },
    { id: 'crunch_cable', sets: 2, reps: '15-20' },
  ],
  pull: [
    { id: 'lat_pulldown', sets: 3, reps: '8-10' },
    { id: 'row_barbell', sets: 3, reps: '8-10' },
    { id: 'row_chest_supported', sets: 3, reps: '10-12' },
    { id: 'face_pull', sets: 3, reps: '15-20' },
    { id: 'curl_incline', sets: 3, reps: '10-12' },
    { id: 'curl_hammer', sets: 3, reps: '10-12' },
    { id: 'curl_reverse', sets: 2, reps: '12-15' },
  ],
  legs: [
    { id: 'leg_press', sets: 4, reps: '10-12' },
    { id: 'rdl_barbell', sets: 3, reps: '8-10' },
    { id: 'leg_extension', sets: 3, reps: '12-15' },
    { id: 'leg_curl_lying', sets: 3, reps: '10-12' },
    { id: 'split_squat_bulgarian', sets: 3, reps: '10 each' },
    { id: 'calf_raise_standing', sets: 3, reps: '12-15' },
  ],
  cardio: [
    { id: 'cardio_warmup', sets: 1, reps: '5 min', name: 'Warm-up', muscles: 'Full body' },
    { id: 'cardio_main', sets: 1, reps: '20-30 min', name: 'Steady State Cardio', muscles: 'Cardiovascular' },
    { id: 'cardio_cooldown', sets: 1, reps: '5 min', name: 'Cool-down', muscles: 'Recovery' },
  ],
};

export const workoutTypes = {
  push: { name: 'Push', subtitle: 'Chest · Shoulders · Triceps', color: '#3b82f6' },
  pull: { name: 'Pull', subtitle: 'Back · Biceps · Forearms', color: '#8b5cf6' },
  legs: { name: 'Legs', subtitle: 'Quads · Hamstrings · Glutes', color: '#f97316' },
  cardio: { name: 'Cardio', subtitle: 'Heart health · Recovery', color: '#10b981' },
};

export default workoutTemplates;

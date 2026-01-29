// Workout templates for Push/Pull/Legs/Cardio
export const workoutTemplates = {
  Push: [
    { id: 'chest_press_incline', sets: 3, reps: '8-10' },
    { id: 'chest_press_flat_bb', sets: 3, reps: '8-10' },
    { id: 'shoulder_press_db', sets: 3, reps: '10-12' },
    { id: 'chest_fly_cable', sets: 3, reps: '12-15' },
    { id: 'lateral_raise_db', sets: 3, reps: '12-15' },
    { id: 'tricep_pushdown_rope', sets: 3, reps: '10-12' },
    { id: 'tricep_overhead_cable', sets: 3, reps: '12-15' },
    { id: 'cable_crunch', sets: 3, reps: '15-20' },
  ],
  Pull: [
    { id: 'pullup', sets: 3, reps: '6-10' },
    { id: 'row_chest_supported', sets: 3, reps: '8-10' },
    { id: 'row_cable_1arm', sets: 3, reps: '10-12' },
    { id: 'rear_delt_fly_cable', sets: 3, reps: '12-15' },
    { id: 'face_pull', sets: 3, reps: '15-20' },
    { id: 'curl_incline', sets: 3, reps: '10-12' },
    { id: 'curl_hammer', sets: 3, reps: '10-12' },
    { id: 'curl_reverse', sets: 3, reps: '12-15' },
    { id: 'wrist_curl', sets: 2, reps: '15-20' },
  ],
  Legs: [
    { id: 'squat_hack', sets: 4, reps: '8-12' },
    { id: 'rdl', sets: 3, reps: '8-10' },
    { id: 'leg_extension', sets: 3, reps: '12-15' },
    { id: 'leg_curl_seated', sets: 3, reps: '12-15' },
    { id: 'bulgarian_split_squat', sets: 2, reps: '10-12' },
    { id: 'calf_raise_standing', sets: 4, reps: '15-20' },
    { id: 'calf_raise_seated', sets: 3, reps: '15-20' },
  ],
  Cardio: [
    { id: 'cardio_treadmill_walk', sets: 1, reps: '30', duration: 30 }, // duration in minutes
  ],
};

// Get total sets for a workout type
export const getTotalSets = (type) => {
  const template = workoutTemplates[type];
  return template ? template.reduce((sum, ex) => sum + ex.sets, 0) : 0;
};

// Get workout color
export const getWorkoutColor = (type) => {
  const colors = {
    Push: '#3b82f6',
    Pull: '#8b5cf6',
    Legs: '#f97316',
    Cardio: '#10b981',
  };
  return colors[type] || '#71717a';
};

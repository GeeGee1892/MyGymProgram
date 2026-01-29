// Exercise database with form cues, muscle targets, and media paths
// Media paths use require() for Expo/React Native bundling

export const exerciseDB = {
  // CHEST
  chest_press_incline: {
    name: 'Incline Dumbbell Press',
    muscles: 'Upper chest, front delts',
    cues: ['Set bench to 30° incline', 'Control the negative', 'Full stretch at bottom', 'Press to full lockout'],
    media: require('../../assets/exercises/chest/chest_press_incline.png')
  },
  chest_press_flat_bb: {
    name: 'Flat Bench Press',
    muscles: 'Mid chest, triceps',
    cues: ['Maintain slight arch', 'Touch mid-chest', 'Drive through floor', 'Explosive concentric'],
    media: require('../../assets/exercises/chest/chest_press_flat_bb.png')
  },
  chest_press_flat_db: {
    name: 'Flat Dumbbell Press',
    muscles: 'Mid chest, triceps',
    cues: ['Full range of motion', 'Squeeze at top', 'Palms forward', 'Control descent'],
    media: require('../../assets/exercises/chest/chest_press_flat_db.png')
  },
  chest_press_machine: {
    name: 'Machine Chest Press',
    muscles: 'Chest, triceps',
    cues: ['Adjust seat height', 'Full extension', 'Shoulders back', 'Controlled tempo'],
    media: require('../../assets/exercises/chest/chest_press_machine.png')
  },
  chest_fly_cable: {
    name: 'Cable Fly',
    muscles: 'Chest',
    cues: ['Slight elbow bend throughout', 'Squeeze at center', 'Feel chest stretch', 'Slow eccentric'],
    media: require('../../assets/exercises/chest/chest_fly_cable.png')
  },
  chest_fly_machine: {
    name: 'Pec Deck',
    muscles: 'Chest',
    cues: ['Elbows at 90°', 'Squeeze hard at contraction', 'Pause for 1 second', 'Full stretch'],
    media: null // No mapping found
  },
  chest_dip: {
    name: 'Chest Dip',
    muscles: 'Lower chest, triceps',
    cues: ['Lean forward 20-30°', 'Deep stretch', 'Full lockout', 'Elbows flared slightly'],
    media: null // No mapping found
  },

  // SHOULDERS
  shoulder_press_db: {
    name: 'Seated Dumbbell Press',
    muscles: 'Front & side delts',
    cues: ['Maintain neutral spine', 'Full lockout overhead', 'Elbows under hands', 'Core tight'],
    media: require('../../assets/exercises/shoulders/shoulder_press_db.png')
  },
  shoulder_press_machine: {
    name: 'Machine Shoulder Press',
    muscles: 'Shoulders',
    cues: ['Back against pad', 'Full range of motion', 'No momentum', 'Control descent'],
    media: require('../../assets/exercises/shoulders/shoulder_press_machine.png')
  },
  shoulder_press_bb: {
    name: 'Overhead Barbell Press',
    muscles: 'Shoulders, triceps',
    cues: ['Tight core', 'Full lockout', 'Bar path straight', 'Squeeze glutes'],
    media: require('../../assets/exercises/shoulders/shoulder_press_bb.png')
  },
  lateral_raise_db: {
    name: 'Dumbbell Lateral Raise',
    muscles: 'Side delts',
    cues: ['Lead with elbows', 'No swinging', 'Stop at shoulder height', 'Slight forward lean'],
    media: require('../../assets/exercises/shoulders/shoulder_lateral_raise.png')
  },
  lateral_raise_cable: {
    name: 'Cable Lateral Raise',
    muscles: 'Side delts',
    cues: ['Constant tension', 'Control throughout', 'Feel side delt burn', "Don't shrug"],
    media: require('../../assets/exercises/shoulders/shoulder_lateral_raise_cable.png')
  },
  lateral_raise_machine: {
    name: 'Machine Lateral Raise',
    muscles: 'Side delts',
    cues: ['Squeeze at top', 'Full ROM', 'No bouncing', 'Keep shoulders down'],
    media: null // No mapping found
  },

  // TRICEPS
  tricep_pushdown_rope: {
    name: 'Rope Pushdown',
    muscles: 'Triceps',
    cues: ['Elbows pinned to sides', 'Spread rope at bottom', 'Full extension', 'Squeeze contraction'],
    media: require('../../assets/exercises/arms/tricep_pushdown_rope.png')
  },
  tricep_pushdown_bar: {
    name: 'Bar Pushdown',
    muscles: 'Triceps',
    cues: ['Elbows stationary', 'Full lockout', 'Squeeze triceps', 'Controlled negative'],
    media: require('../../assets/exercises/arms/tricep_pushdown_bar.png')
  },
  tricep_overhead_cable: {
    name: 'Overhead Cable Extension',
    muscles: 'Triceps long head',
    cues: ['Elbows forward and high', 'Full stretch', 'Lock out completely', 'Feel long head work'],
    media: require('../../assets/exercises/arms/tricep_extension_overhead.png')
  },
  tricep_overhead_db: {
    name: 'Overhead Dumbbell Extension',
    muscles: 'Triceps long head',
    cues: ['Elbows close together', 'Full range of motion', 'Control weight', 'Deep stretch'],
    media: require('../../assets/exercises/arms/tricep_extension_db.png')
  },
  tricep_skullcrusher: {
    name: 'Skull Crushers',
    muscles: 'Triceps',
    cues: ['Lower to forehead', 'Elbows stationary', 'Full extension', 'Control descent'],
    media: null // No mapping found
  },
  tricep_dip: {
    name: 'Tricep Dip',
    muscles: 'Triceps',
    cues: ['Upright torso', 'Full lockout at top', 'Deep dip', 'Elbows back'],
    media: require('../../assets/exercises/arms/tricep_dip.png')
  },
  tricep_kickback: {
    name: 'Tricep Kickback',
    muscles: 'Triceps',
    cues: ['Full extension at top', 'Squeeze hard', 'Upper arm parallel', 'Control return'],
    media: null // No mapping found
  },

  // BACK
  lat_pulldown: {
    name: 'Lat Pulldown',
    muscles: 'Lats, biceps',
    cues: ['Slight lean back', 'Pull to upper chest', 'Squeeze shoulder blades', 'Full stretch at top'],
    media: require('../../assets/exercises/back/lat_pulldown.png')
  },
  lat_pulldown_close: {
    name: 'Close Grip Pulldown',
    muscles: 'Lats, mid-back',
    cues: ['Vertical torso', 'Squeeze lats hard', 'Touch lower chest', 'Full ROM'],
    media: require('../../assets/exercises/back/lat_pulldown_close.png')
  },
  pullup: {
    name: 'Pull-Up',
    muscles: 'Lats, biceps',
    cues: ['Dead hang start', 'Chin over bar', 'Control descent', 'Full scapular depression'],
    media: require('../../assets/exercises/back/pullup_weighted.png')
  },
  pullup_assisted: {
    name: 'Assisted Pull-Up',
    muscles: 'Lats, biceps',
    cues: ['Full range of motion', 'Control speed', 'Squeeze at top', 'Build to bodyweight'],
    media: require('../../assets/exercises/back/pullup_assisted.png')
  },
  row_barbell: {
    name: 'Barbell Row',
    muscles: 'Mid-back, lats',
    cues: ['Hinge at hips 45°', 'Pull to lower sternum', 'Squeeze at top', 'Flat back'],
    media: require('../../assets/exercises/back/row_bb_bent.png')
  },
  row_dumbbell: {
    name: 'Dumbbell Row',
    muscles: 'Lats, mid-back',
    cues: ['Pull to hip level', 'Full stretch at bottom', 'Elbow close to body', 'Squeeze at top'],
    media: require('../../assets/exercises/back/row_single_arm.png')
  },
  row_cable_seated: {
    name: 'Seated Cable Row',
    muscles: 'Mid-back',
    cues: ['Chest up tall', 'Pull to sternum', 'Squeeze shoulder blades', 'Slight lean back'],
    media: require('../../assets/exercises/back/row_cable.png')
  },
  row_chest_supported: {
    name: 'Chest Supported Row',
    muscles: 'Mid-back, rear delts',
    cues: ['No momentum', 'Squeeze hard', 'Full ROM', 'Feel mid-back contract'],
    media: require('../../assets/exercises/back/row_db_chest.png')
  },
  row_machine: {
    name: 'Machine Row',
    muscles: 'Mid-back',
    cues: ['Full range of motion', 'Control tempo', 'Chest to pad', 'Squeeze at contraction'],
    media: null // No mapping found
  },
  row_cable_1arm: {
    name: '1-Arm Cable Row',
    muscles: 'Lats, mid-back',
    cues: ['Pull to hip', 'Rotate slightly', 'Full stretch', 'Squeeze lat'],
    media: require('../../assets/exercises/back/row_cable_1arm.png')
  },

  // REAR DELTS
  face_pull: {
    name: 'Face Pull',
    muscles: 'Rear delts, rotator cuff',
    cues: ['Pull high to face', 'External rotation', 'Squeeze rear delts', 'Elbows high'],
    media: require('../../assets/exercises/shoulders/face_pull.png')
  },
  rear_delt_fly_cable: {
    name: 'Cable Rear Delt Fly',
    muscles: 'Rear delts',
    cues: ['Lead with elbows', 'Slight bend in arms', 'Squeeze back', 'Control return'],
    media: require('../../assets/exercises/shoulders/rear_delt_fly_cable.png')
  },
  rear_delt_fly_machine: {
    name: 'Reverse Pec Deck',
    muscles: 'Rear delts',
    cues: ['Chest to pad', 'Squeeze rear delts', 'Lead with elbows', 'Full ROM'],
    media: null // No mapping found
  },

  // BICEPS
  curl_incline: {
    name: 'Incline Dumbbell Curl',
    muscles: 'Biceps (long head)',
    cues: ['Arms hang straight back', 'No swinging', 'Full ROM', 'Squeeze at top'],
    media: require('../../assets/exercises/arms/curl_db_incline.png')
  },
  curl_preacher: {
    name: 'Preacher Curl',
    muscles: 'Biceps',
    cues: ['Full extension at bottom', 'Squeeze contraction', 'No momentum', 'Control negative'],
    media: require('../../assets/exercises/arms/curl_preacher.png')
  },
  curl_cable: {
    name: 'Cable Curl',
    muscles: 'Biceps',
    cues: ['Constant tension', 'Elbows pinned', 'Full ROM', 'Squeeze peak'],
    media: require('../../assets/exercises/arms/curl_cable.png')
  },
  curl_dumbbell: {
    name: 'Dumbbell Curl',
    muscles: 'Biceps',
    cues: ['Supinate at top', 'No swinging', 'Control descent', 'Full extension'],
    media: require('../../assets/exercises/arms/curl_db_standing.png')
  },
  curl_hammer: {
    name: 'Hammer Curl',
    muscles: 'Brachialis, forearms',
    cues: ['Neutral grip throughout', 'Control tempo', 'Full ROM', 'No body English'],
    media: require('../../assets/exercises/arms/curl_hammer.png')
  },
  curl_reverse: {
    name: 'Reverse Curl',
    muscles: 'Forearm extensors, brachialis',
    cues: ['Overhand grip', 'Wrists straight', 'Slow tempo', 'Feel forearms work'],
    media: require('../../assets/exercises/arms/curl_reverse.png')
  },

  // FOREARMS
  wrist_curl: {
    name: 'Wrist Curl',
    muscles: 'Forearm flexors',
    cues: ['Forearms on bench', 'Full ROM', 'Squeeze at top', 'Control descent'],
    media: require('../../assets/exercises/arms/wrist_curl.png')
  },
  wrist_curl_cable: {
    name: 'Cable Wrist Curl',
    muscles: 'Forearm flexors',
    cues: ['Constant tension', 'Full flexion', 'Control tempo', 'High reps'],
    media: null // No mapping found
  },
  farmers_walk: {
    name: "Farmer's Walk",
    muscles: 'Grip, forearms, traps',
    cues: ['Heavy weights', 'Walk controlled', 'Chest up', 'Squeeze grip hard'],
    media: null // No mapping found
  },

  // ABS
  cable_crunch: {
    name: 'Cable Crunch',
    muscles: 'Abs',
    cues: ['Crunch ribcage to pelvis', 'Hold contraction', 'Controlled return', "Don't use arms"],
    media: require('../../assets/exercises/abs/crunch_cable.png')
  },
  hanging_knee_raise: {
    name: 'Hanging Knee Raise',
    muscles: 'Lower abs',
    cues: ['Tuck pelvis up', 'Control descent', 'No swinging', 'Full ROM'],
    media: require('../../assets/exercises/abs/knee_raise_hanging.png')
  },
  plank: {
    name: 'Plank',
    muscles: 'Core',
    cues: ['Straight line head to heels', 'Squeeze core', "Don't sag", 'Breathe steadily'],
    media: require('../../assets/exercises/abs/abs_plank.png')
  },
  ab_wheel: {
    name: 'Ab Wheel Rollout',
    muscles: 'Abs, core',
    cues: ['Control rollout', "Don't hyperextend", 'Pull back with abs', 'Tight core'],
    media: require('../../assets/exercises/abs/abs_crunch_cable.png')
  },

  // LEGS - QUADS
  squat_hack: {
    name: 'Hack Squat',
    muscles: 'Quads, glutes',
    cues: ['Full depth', 'Drive through heels', 'Chest up', 'Knees track toes'],
    media: require('../../assets/exercises/legs/squat_hack.png')
  },
  squat_barbell: {
    name: 'Barbell Squat',
    muscles: 'Quads, glutes, entire body',
    cues: ['Bar on traps', 'Knees out', 'Break at hips', 'Drive up explosively'],
    media: require('../../assets/exercises/legs/squat_barbell.png')
  },
  squat_goblet: {
    name: 'Goblet Squat',
    muscles: 'Quads, glutes',
    cues: ['DB at chest', 'Upright torso', 'Elbows inside knees', 'Full depth'],
    media: null // No mapping found
  },
  leg_press: {
    name: 'Leg Press',
    muscles: 'Quads, glutes',
    cues: ['Full depth', "Don't lock knees", 'Drive through full foot', 'Control descent'],
    media: require('../../assets/exercises/legs/leg_press.png')
  },
  leg_extension: {
    name: 'Leg Extension',
    muscles: 'Quads',
    cues: ['Full lockout', 'Squeeze quads', 'Control negative', 'Stay seated'],
    media: require('../../assets/exercises/legs/leg_extension.png')
  },
  bulgarian_split_squat: {
    name: 'Bulgarian Split Squat',
    muscles: 'Quads, glutes',
    cues: ['Front shin vertical', 'Full depth', 'Balance and control', 'Drive through heel'],
    media: require('../../assets/exercises/legs/lunge_bulgarian.png')
  },

  // LEGS - HAMSTRINGS/GLUTES
  rdl: {
    name: 'Romanian Deadlift',
    muscles: 'Hamstrings, glutes',
    cues: ['Hinge at hips', 'Slight knee bend', 'Feel hamstring stretch', 'Drive hips forward'],
    media: require('../../assets/exercises/legs/deadlift_romanian.png')
  },
  rdl_dumbbell: {
    name: 'Dumbbell RDL',
    muscles: 'Hamstrings, glutes',
    cues: ['Keep back straight', 'Push hips back', 'Feel stretch', 'Squeeze glutes at top'],
    media: require('../../assets/exercises/legs/deadlift_romanian_db.png')
  },
  leg_curl_lying: {
    name: 'Lying Leg Curl',
    muscles: 'Hamstrings',
    cues: ['Full ROM', 'Squeeze at top', 'Control descent', 'Hips down'],
    media: require('../../assets/exercises/legs/leg_curl_lying.png')
  },
  leg_curl_seated: {
    name: 'Seated Leg Curl',
    muscles: 'Hamstrings',
    cues: ['Full curl', 'Pause at contraction', 'Slow negative', 'Stay seated'],
    media: require('../../assets/exercises/legs/leg_curl_seated.png')
  },
  hip_thrust: {
    name: 'Hip Thrust',
    muscles: 'Glutes',
    cues: ['Shoulders on bench', 'Drive through heels', 'Squeeze glutes at top', 'Full hip extension'],
    media: require('../../assets/exercises/legs/hip_thrust.png')
  },
  glute_ham_raise: {
    name: 'Glute-Ham Raise',
    muscles: 'Hamstrings, glutes',
    cues: ['Control descent', 'Push toes down', 'Squeeze at top', 'Full ROM'],
    media: null // No mapping found
  },

  // LEGS - CALVES
  calf_raise_standing: {
    name: 'Standing Calf Raise',
    muscles: 'Calves (gastrocnemius)',
    cues: ['Full stretch at bottom', 'Full extension at top', 'Pause at peak', 'Slow negative'],
    media: require('../../assets/exercises/legs/calf_raise_standing.png')
  },
  calf_raise_seated: {
    name: 'Seated Calf Raise',
    muscles: 'Calves (soleus)',
    cues: ['Full ROM', 'Squeeze at top', 'Control descent', 'High reps'],
    media: require('../../assets/exercises/legs/calf_raise_seated.png')
  },

  // CARDIO OPTIONS
  cardio_treadmill_walk: {
    name: 'Treadmill Walk',
    muscles: 'Cardio - Low Intensity',
    cues: ['Comfortable pace', 'Can hold conversation', 'Zone 2 heart rate', 'Steady state'],
    media: null
  },
  cardio_stairmaster: {
    name: 'Stairmaster',
    muscles: 'Cardio - Moderate',
    cues: ['Steady rhythm', "Don't lean on rails", 'Glutes engaged', 'Moderate intensity'],
    media: null
  },
  cardio_jog: {
    name: 'Jog',
    muscles: 'Cardio - Moderate',
    cues: ['Conversational pace', 'Zone 2-3 heart rate', 'Steady breathing', 'Land midfoot'],
    media: null
  },
  cardio_cycle: {
    name: 'Cycling',
    muscles: 'Cardio - Variable',
    cues: ['Adjust resistance', 'Steady cadence', 'Upright posture', 'Can vary intensity'],
    media: null
  },
  cardio_rowing: {
    name: 'Rowing Machine',
    muscles: 'Cardio - Full Body',
    cues: ['Drive with legs', 'Pull to sternum', 'Control return', 'Steady pace'],
    media: null
  },
  cardio_elliptical: {
    name: 'Elliptical',
    muscles: 'Cardio - Low Impact',
    cues: ['Smooth motion', "Don't lean heavy", 'Steady pace', 'Low joint stress'],
    media: null
  },
};

// Helper to get exercise by ID with fallback
export const getExercise = (id) => exerciseDB[id] || { 
  name: id, 
  muscles: 'Unknown', 
  cues: [],
  media: null 
};

// Helper to get all exercises as array
export const getAllExercises = () => Object.entries(exerciseDB).map(([id, data]) => ({
  id,
  ...data
}));

// Helper to get exercises by muscle group
export const getExercisesByMuscle = (muscle) => {
  return getAllExercises().filter(ex => 
    ex.muscles.toLowerCase().includes(muscle.toLowerCase())
  );
};

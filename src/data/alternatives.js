// Alternative exercises for each movement pattern
// IMPORTANT: All alternatives are bidirectional - if A can swap to B, then B can swap to A
export const alternatives = {
  // CHEST PRESS - all can swap to each other
  chest_press_incline: ['chest_press_flat_bb', 'chest_press_flat_db', 'chest_press_machine'],
  chest_press_flat_bb: ['chest_press_incline', 'chest_press_flat_db', 'chest_press_machine'],
  chest_press_flat_db: ['chest_press_incline', 'chest_press_flat_bb', 'chest_press_machine'],
  chest_press_machine: ['chest_press_incline', 'chest_press_flat_bb', 'chest_press_flat_db'],
  
  // CHEST FLY
  chest_fly_cable: ['chest_fly_machine', 'chest_dip'],
  chest_fly_machine: ['chest_fly_cable', 'chest_dip'],
  chest_dip: ['chest_fly_cable', 'chest_fly_machine'],
  
  // SHOULDER PRESS
  shoulder_press_db: ['shoulder_press_machine', 'shoulder_press_bb'],
  shoulder_press_machine: ['shoulder_press_db', 'shoulder_press_bb'],
  shoulder_press_bb: ['shoulder_press_db', 'shoulder_press_machine'],
  
  // LATERAL RAISES
  lateral_raise_db: ['lateral_raise_cable', 'lateral_raise_machine'],
  lateral_raise_cable: ['lateral_raise_db', 'lateral_raise_machine'],
  lateral_raise_machine: ['lateral_raise_db', 'lateral_raise_cable'],
  
  // TRICEPS PUSHDOWN
  tricep_pushdown_rope: ['tricep_pushdown_bar'],
  tricep_pushdown_bar: ['tricep_pushdown_rope'],
  
  // TRICEPS OVERHEAD
  tricep_overhead_cable: ['tricep_overhead_db', 'tricep_skullcrusher'],
  tricep_overhead_db: ['tricep_overhead_cable', 'tricep_skullcrusher'],
  tricep_skullcrusher: ['tricep_overhead_cable', 'tricep_overhead_db'],
  
  // TRICEPS OTHER
  tricep_dip: ['tricep_kickback'],
  tricep_kickback: ['tricep_dip'],
  
  // LAT PULLDOWN
  lat_pulldown: ['lat_pulldown_close', 'pullup', 'pullup_assisted'],
  lat_pulldown_close: ['lat_pulldown', 'pullup', 'pullup_assisted'],
  pullup: ['pullup_assisted', 'lat_pulldown', 'lat_pulldown_close'],
  pullup_assisted: ['pullup', 'lat_pulldown', 'lat_pulldown_close'],
  
  // ROWS
  row_barbell: ['row_dumbbell', 'row_cable_seated', 'row_chest_supported', 'row_machine'],
  row_dumbbell: ['row_barbell', 'row_cable_seated', 'row_chest_supported', 'row_machine'],
  row_cable_seated: ['row_barbell', 'row_dumbbell', 'row_chest_supported', 'row_machine'],
  row_chest_supported: ['row_barbell', 'row_dumbbell', 'row_cable_seated', 'row_machine'],
  row_machine: ['row_barbell', 'row_dumbbell', 'row_cable_seated', 'row_chest_supported'],
  row_cable_1arm: ['row_dumbbell', 'row_cable_seated'],
  
  // REAR DELTS
  face_pull: ['rear_delt_fly_cable', 'rear_delt_fly_machine'],
  rear_delt_fly_cable: ['face_pull', 'rear_delt_fly_machine'],
  rear_delt_fly_machine: ['face_pull', 'rear_delt_fly_cable'],
  
  // BICEPS
  curl_incline: ['curl_dumbbell', 'curl_cable', 'curl_preacher'],
  curl_preacher: ['curl_incline', 'curl_dumbbell', 'curl_cable'],
  curl_cable: ['curl_incline', 'curl_dumbbell', 'curl_preacher'],
  curl_dumbbell: ['curl_incline', 'curl_cable', 'curl_preacher'],
  curl_hammer: ['curl_reverse'],
  curl_reverse: ['curl_hammer'],
  
  // FOREARMS
  wrist_curl: ['wrist_curl_cable', 'farmers_walk'],
  wrist_curl_cable: ['wrist_curl', 'farmers_walk'],
  farmers_walk: ['wrist_curl', 'wrist_curl_cable'],
  
  // ABS
  cable_crunch: ['hanging_knee_raise', 'ab_wheel'],
  hanging_knee_raise: ['cable_crunch', 'ab_wheel'],
  plank: ['ab_wheel'],
  ab_wheel: ['plank', 'cable_crunch'],
  
  // QUADS
  squat_hack: ['leg_press', 'squat_barbell', 'squat_goblet'],
  squat_barbell: ['squat_hack', 'leg_press', 'squat_goblet'],
  squat_goblet: ['squat_hack', 'leg_press', 'squat_barbell'],
  leg_press: ['squat_hack', 'squat_barbell', 'squat_goblet'],
  leg_extension: [],
  bulgarian_split_squat: [],
  
  // HAMSTRINGS/GLUTES
  rdl: ['rdl_dumbbell', 'glute_ham_raise'],
  rdl_dumbbell: ['rdl', 'glute_ham_raise'],
  leg_curl_lying: ['leg_curl_seated'],
  leg_curl_seated: ['leg_curl_lying'],
  hip_thrust: ['glute_ham_raise'],
  glute_ham_raise: ['hip_thrust', 'rdl'],
  
  // CALVES
  calf_raise_standing: ['calf_raise_seated'],
  calf_raise_seated: ['calf_raise_standing'],
  
  // CARDIO
  cardio_treadmill_walk: ['cardio_elliptical', 'cardio_cycle'],
  cardio_stairmaster: ['cardio_jog', 'cardio_rowing'],
  cardio_jog: ['cardio_stairmaster', 'cardio_cycle'],
  cardio_cycle: ['cardio_elliptical', 'cardio_jog'],
  cardio_rowing: ['cardio_stairmaster', 'cardio_jog'],
  cardio_elliptical: ['cardio_treadmill_walk', 'cardio_cycle'],
};

// Helper function to get alternatives for any exercise
// Returns alternatives array even if exercise was swapped
export const getAlternatives = (exerciseId) => {
  // Direct lookup
  if (alternatives[exerciseId]) {
    return alternatives[exerciseId];
  }
  
  // If not found, find exercises that have this as an alternative (reverse lookup)
  // This handles cases where an exercise was swapped but we still want swap options
  const reverseAlternatives = [];
  Object.keys(alternatives).forEach(key => {
    if (alternatives[key].includes(exerciseId)) {
      reverseAlternatives.push(key);
      // Also add siblings (other alternatives of the parent)
      alternatives[key].forEach(alt => {
        if (alt !== exerciseId && !reverseAlternatives.includes(alt)) {
          reverseAlternatives.push(alt);
        }
      });
    }
  });
  
  return reverseAlternatives.length > 0 ? reverseAlternatives : [];
};

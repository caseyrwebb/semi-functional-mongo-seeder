function randomWithLimits(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included
}

const acsvdata = {
  id: null,
  _created: Date.now(),
  time: null,
  _mission: null,
  _source: null,
  _raw: null,
  percent_open: randomWithLimits(0, 100),
  target_reached: null,
  is_closed: null,
  in_transit: null,
  following_or_homing_error: null,
  quickstop_on: null,
  homing_success: null,
  in_fault: null,
  is_homing: null,
  avg_ma: null,
  timestamp_mission_days: null,
  timestamp_deciseconds: null,
};

const crownmaxondata = {
  id: null,
  _created: Date.now(),
  time: null,
  _mission: null,
  _source: null,
  _raw: null,
  percent_open: randomWithLimits(0, 100),
  target_reached: null,
  is_open: null,
  in_transit: null,
  following_or_homing_error: null,
  quickstop_on: null,
  homing_success: null,
  in_fault: null,
  is_homing: null,
  avg_ma: null,
  timestamp_mission_days: null,
  timestamp_deciseconds: null,
};

module.exports = { acsvdata, crownmaxondata };

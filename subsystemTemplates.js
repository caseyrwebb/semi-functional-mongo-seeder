function randomWithLimits(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included
}
const acsvdata = () => {
  return {
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
};
const acsvdata2 = {
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

const crownmaxondata = () => {
  return {
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
};

const pumpmsgfb = () => {
  return {
    id: null,
    _created: Date.now(),
    time: null,
    _mission: null,
    _source: null,
    _raw: null,
    pump_enabled: randomWithLimits(0, 1),
    pump_reserved: null,
    pump_limited_over_temp_motor: null,
    pump_limited_over_temp_controller: null,
    pump_limited_bus_under_voltage: null,
    pump_surge_protect_enabled: null,
    pump_compressor_enabled: null,
    bus_voltage: null,
    motor_feedback_amps: null,
    rpm: null,
    controller_temp_c: null,
    motor_temp_c: null,
    current_to_esc_amps: null,
    timestamp_mission_days: null,
    timestamp_deciseconds: null,
  };
};

const ublox = () => {
  return {
    id: null,
    _created: Date.now(),
    utc_hours: null,
    utc_minutes: null,
    utc_seconds: null,
    latitude_deg: randomWithLimits(30, 35),
    longitude_deg: randomWithLimits(100, 120),
    num_satellites: null,
    altitude_m: randomWithLimits(0, 40),
    fix_and_hemisphere_reserved: null,
    fix_and_hemisphere_fix_status: null,
    fix_and_hemisphere_easting: null,
    fix_and_hemisphere_northing: null,
    decimal_locations_altitude: null,
    decimal_locations_longitude: null,
    decimal_locations_latitude: null,
    timestamp_mission_days: null,
    timestamp_deciseconds: null,
  };
};

const deltappressure = () => {
  return {
    id: null,
    _created: Date.now(),
    time: null,
    _mission: null,
    _source: null,
    _raw: null,
    hw_deltap_1: randomWithLimits(0, 100),
    hw_deltap_2: randomWithLimits(0, 100),
    rs_deltap: randomWithLimits(0, 100),
    timestamp_mission_days: null,
    timestamp_deciseconds: null,
  };
};

module.exports = {
  acsvdata,
  crownmaxondata,
  acsvdata2,
  pumpmsgfb,
  ublox,
  deltappressure,
};

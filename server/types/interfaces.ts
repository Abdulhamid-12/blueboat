export interface Distance {
    vehicle_id: number;
    min_distance: number;
    max_distance: number;
    current_distance: number;
    created_at: string;
}

export interface battery_status {
    vehicle_id: number;
    current_consumed: number;
    energy_consumed: number;
    temperature: number;
    voltages: number[];
    current_battery: number;
    created_at: string;
}

export interface Location {
    vehicle_id: number;
    lat: number;
    lon: number;
    created_at: string;
}

export interface Navigation {
    vehicle_id: number;
    airspeed: number;
    groundspeed: number;
    climb: number;
    heading: number;
    throttle: number;
    created_at: string;
}

export interface Attitude {
    vehicle_id: number;
    roll: number;
    pitch: number;
    yaw: number;
    rollspeed: number;
    pitchspeed: number;
    yawspeed: number;
    created_at: string;
}

export interface SCALED_PRESSURE {
    vehicle_id: number;
    press_abs: number;
    press_diff: number;
    temperature: number;
    created_at: string;
}

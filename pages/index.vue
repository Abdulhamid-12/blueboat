<template>
  <div>
    <h1 class="text-3xl text-center p-2 my-5">Dashboard</h1>
    <div class="grid grid-cols-3 gap-4 mb-10">
      <UCard v-if="false" variant="outline">
        <template #header>
          <h2 class="text-xl font-bold">Post Request</h2>
        </template>
        <UButton @click="postLocation">Post Location</UButton>
        <UButton @click="postBatteryStatus">Post Battery</UButton>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Battery Status</h2>
        </template>
        <p>Voltage: {{ BATTERY_STATUS.message.voltages[0] }} mV</p>
        <p>Current: {{ BATTERY_STATUS.message.current_battery }} A</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">GPS Position</h2>
        </template>
        <p>Latitude: {{ GPS_RAW_INT.message.lat }}</p>
        <p>Longitude: {{ GPS_RAW_INT.message.lon }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Depth Sensor</h2>
        </template>
        <p>Current Depth: {{ DISTANCE_SENSOR.message.current_distance }} cm</p>
        <p>Min Depth: {{ DISTANCE_SENSOR.message.min_distance }} cm</p>
        <p>Max Depth: {{ DISTANCE_SENSOR.message.max_distance }} cm</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Attitude</h2>
        </template>
        <p>Roll: {{ ATTITUDE.message.roll }}</p>
        <p>Pitch: {{ ATTITUDE.message.pitch }}</p>
        <p>Yaw: {{ ATTITUDE.message.yaw }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">VFR HUD</h2>
        </template>
        <p>Ground Speed: {{ Navigation.message.groundspeed }} m/s</p>
        <p>Altitude: {{ Navigation.message.alt }} m</p>
        <p>Heading: {{ Navigation.message.heading }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Scaled Pressure</h2>
        </template>
        <p>Pressure: {{ SCALED_PRESSURE.message.press_abs }} hPa</p>
        <p>Temperature: {{ SCALED_PRESSURE.message.temperature }} °C</p>
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-10">
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Battery Voltage</h2>
        </template>
        <BaseChart :data="{
          labels: ['Voltage'],
          datasets: [
            {
              label: 'Battery Voltage',
              data: [BATTERY_STATUS.message.voltages[0]],
              backgroundColor: ['#FF6384'],
            },
          ],
        }" :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }" type="bar" />
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Battery Current</h2>
        </template>
        <BaseChart :data="{
          labels: ['Current'],
          datasets: [
            {
              label: 'Battery Current',
              data: [BATTERY_STATUS.message.current_battery],
              backgroundColor: ['#36A2EB'],
            },
          ],
        }" :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }" type="bar" />
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-10">
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Temperature </h2>
        </template>
        <BaseChart :data="{
          labels: ['Time'],
          datasets: [
            {
              label: 'Temperature',
              data: [
                SCALED_PRESSURE.message.temperature,
              ],
              backgroundColor: ['#FF6384'],
            },
          ],
        }" :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }" type="line" />
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Depth Sensor</h2>
        </template>
        <BaseChart :data="{
          labels: ['Current Depth', 'Min Depth', 'Max Depth'],
          datasets: [
            {
              label: 'Depth Sensor',
              data: [
                DISTANCE_SENSOR.message.current_distance,
                DISTANCE_SENSOR.message.min_distance,
                DISTANCE_SENSOR.message.max_distance,
              ],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        }" :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }" type="bar" />
      </UCard>
      <UCard variant="subtle" class="col-span-2">
        <template #header>
          <h2 class="text-xl font-bold">Boat Location</h2>
        </template>

        <LMap style="height: 400px" :zoom="6" :center="[location.lat, location.lon]" :use-global-leaflet="false">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
          <LMarker :lat-lng="[location.lat, location.lon]" />
        </LMap>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import parameteres from "~/assets/mavlink.json";
import BaseChart from "~/components/BaseChart.vue";

const data: any = parameteres["vehicles"]["1"]["components"]["1"]["messages"];

// all below variables can be extracted from data variable.
const GLOBAL_POSITION_INT = {
  message: {
    type: "GLOBAL_POSITION_INT",
    time_boot_ms: 1374286,
    lat: 0,
    lon: 0,
    alt: 1640,
    relative_alt: 1647,
    vx: 0,
    vy: 0,
    vz: 0,
    hdg: 11544,
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:10.898947606Z",
      last_update: "2025-04-21T09:40:58.302546966Z",
      counter: 4115,
      frequency: 0.08543193,
    },
  },
};

// Data: Display roll, pitch, and yaw from the ATTITUDE message.
// Purpose: Visualize the boat's orientation. Gauges are good for real-time display,
// while line charts can show how attitude changes over time, which is useful for analyzing stability or maneuvers.

const ATTITUDE = {
  message: {
    type: "ATTITUDE",
    time_boot_ms: 1374346,
    roll: -0.034403548,
    pitch: 0.005458932,
    yaw: 2.0147777,
    rollspeed: -0.000010309857,
    pitchspeed: 0.000091796275,
    yawspeed: 0.00013940805,
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:10.913199550Z",
      last_update: "2025-04-21T09:40:58.362492851Z",
      counter: 13701,
      frequency: 0.28444785,
    },
  },
};
// Data: Plot voltage_battery and current_battery over time
// Purpose: Monitor battery health, estimate remaining runtime, and identify abnormal power draw.
// A line chart is ideal for showing trends over time.
const BATTERY_STATUS = {
  message: {
    type: "BATTERY_STATUS",
    current_consumed: 190, // mAh
    energy_consumed: 105, // mWh
    temperature: 32767, // mC
    voltages: [
      15341, 65535, 65535, 65535, 65535, 65535, 65535, 65535, 65535, 65535,
    ], // mV
    current_battery: 63, // mA
    id: 0,
    battery_function: {
      type: "MAV_BATTERY_FUNCTION_UNKNOWN",
    },
    mavtype: {
      type: "MAV_BATTERY_TYPE_UNKNOWN",
    },
    battery_remaining: -1,
    time_remaining: 0,
    charge_state: {
      type: "MAV_BATTERY_CHARGE_STATE_OK",
    },
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:10.911116865Z",
      last_update: "2025-04-21T09:40:58.312340245Z",
      counter: 4115,
      frequency: 0.08543193,
    },
  },
};

// line chart for historical data and a gauge for real-time heading are useful.
// Data: Plot temperature from the SCALED_PRESSURE message.
// Purpose: Monitor the temperature of the sensor or environment.

const SCALED_PRESSURE = {
  message: {
    type: "SCALED_PRESSURE",
    time_boot_ms: 1374326,
    press_abs: 1003.5706, // hPa
    press_diff: 0, // hPa
    temperature: 3707, // mC
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:11.784438550Z",
      last_update: "2025-04-21T09:40:58.352320280Z",
      counter: 2744,
      frequency: 0.056969646,
    },
  },
};

// Purpose: Track the boat's depth relative to its starting point or the surface.
// A line chart shows the depth profile over time.
const DISTANCE_SENSOR = {
  message: {
    type: "DISTANCE_SENSOR",
    time_boot_ms: 1374286,
    min_distance: 20, // cm
    max_distance: 12000, // cm
    current_distance: 9589, // cm
    mavtype: {
      type: "MAV_DISTANCE_SENSOR_ULTRASOUND",
    },
    id: 0,
    orientation: {
      type: "MAV_SENSOR_ROTATION_PITCH_270",
    },
    covariance: 0,
    horizontal_fov: 0,
    vertical_fov: 0,
    quaternion: [0, 0, 0, 0],
    signal_quality: 1,
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:36.808642554Z",
      last_update: "2025-04-21T09:40:58.305782009Z",
      counter: 3919,
      frequency: 0.0814067,
    },
  },
};

const GPS_RAW_INT = {
  message: {
    type: "GPS_RAW_INT",
    time_usec: 0,
    lat: 523648108,
    lon: 665990269,
    alt: 13394150, // cm
    eph: 9999,
    epv: 9999,
    vel: 0,
    cog: 0,
    fix_type: {
      type: "GPS_FIX_TYPE_NO_FIX",
    },
    satellites_visible: 0,
    alt_ellipsoid: 13368990,
    h_acc: 4294967295,
    v_acc: 3750107136,
    vel_acc: 20001,
    hdg_acc: 0,
    yaw: 0,
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:11.785277105Z",
      last_update: "2025-04-21T09:40:58.353101401Z",
      counter: 2744,
      frequency: 0.056969646,
    },
  },
};
// Purpose: Show the boat's speed over ground and its current direction.
// A line chart for historical data and a gauge for real-time heading are useful.
const Navigation = {
  message: {
    type: "VFR_HUD",
    airspeed: 0,
    groundspeed: 0,
    alt: 1.61,
    climb: 0.1617693,
    heading: 115,
    throttle: 0,
  },
  status: {
    time: {
      first_update: "2025-04-20T20:18:10.913254976Z",
      last_update: "2025-04-21T09:40:58.362755138Z",
      counter: 13701,
      frequency: 0.28444785,
    },
  },
};

const location = ref({
  lat: GPS_RAW_INT.message.lat / 10000000,
  lon: GPS_RAW_INT.message.lon / 10000000,
});

async function postLocation() {
  const locationData = {
    vehicle_id: 1,
    lat: GPS_RAW_INT.message.lat,
    lon: GPS_RAW_INT.message.lon
  };
  const res = await $fetch('/api/location', {
    method: 'POST',
    body: locationData,
  });
}
async function postBatteryStatus() {
  const battery_status = {
    vehicle_id: 1,
    current_consumed: BATTERY_STATUS.message.current_consumed,
    energy_consumed: BATTERY_STATUS.message.energy_consumed,
    temperature: BATTERY_STATUS.message.temperature,
    current_battery: BATTERY_STATUS.message.current_battery,
    voltages: BATTERY_STATUS.message.voltages,


  };
  const res = await $fetch('/api/battery_status', {
    method: 'POST',
    body: battery_status,
  });
}

</script>

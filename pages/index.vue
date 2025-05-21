<template>
  <div>
    <h1 class="text-3xl text-center p-2 my-5">Dashboard</h1>
    <div class="flex flex-col justify-center items-center my-4 gap-4">
      <div>
        <UButton
          class="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
          :disabled="isFetching"
          @click="toggleFetching"
          icon="i-heroicons:play-solid"
          icon-position="left"
          :loading="isFetching"
          :loading-text="isFetching ? 'Fetching...' : 'Start Fetching'"
        >
          {{ isFetching ? "Fetching..." : "Start Fetching" }}
        </UButton>
        <UButton
          class="ml-2 px-4 py-2 rounded bg-red-600 text-white disabled:bg-gray-400"
          :disabled="!isFetching"
          @click="toggleFetching"
          icon="i-heroicons:stop-solid"
        >
          Stop Fetching
        </UButton>
      </div>
    </div>
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
        <p>
          Voltage:
          {{ battery_statuses[battery_statuses.length - 1]?.voltages[0] }} mV
        </p>
        <p>
          Current:
          {{ battery_statuses[battery_statuses.length - 1]?.current_consumed }}
          A
        </p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">GPS Position</h2>
        </template>
        <p>Latitude: {{ locations[locations.length - 1]?.lat }}</p>
        <p>Longitude: {{ locations[locations.length - 1]?.lon }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Depth Sensor</h2>
        </template>
        <p>
          Current Depth:
          {{ distances[distances.length - 1]?.current_distance }} cm
        </p>
        <p>Min Depth: {{ distances[distances.length - 1]?.min_distance }} cm</p>
        <p>Max Depth: {{ distances[distances.length - 1]?.max_distance }} cm</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Attitude</h2>
        </template>
        <p>Roll: {{ attitudes[attitudes.length - 1]?.roll }}</p>
        <p>Pitch: {{ attitudes[attitudes.length - 1]?.pitch }}</p>
        <p>Yaw: {{ attitudes[attitudes.length - 1]?.yaw }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Navigation Status</h2>
        </template>
        <p>
          Ground Speed:
          {{ navigations[navigations.length - 1]?.groundspeed }} m/s
        </p>
        <p>Throttle: {{ navigations[navigations.length - 1]?.throttle }} m</p>
        <p>Heading: {{ navigations[navigations.length - 1]?.heading }}</p>
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Scaled Pressure</h2>
        </template>
        <p>
          Pressure:
          {{ scaled_pressures[scaled_pressures.length - 1]?.press_abs }} hPa
        </p>
        <p>
          Temperature:
          {{ scaled_pressures[scaled_pressures.length - 1]?.temperature }} °C
        </p>
      </UCard>
    </div>
    <div class="flex justify-center flex-col items-center gap-4 my-4">
      <UButton icon="" @click="generate" :loading="isGenerating"
        >Generate Insights</UButton
      >
      <UTextarea
        class="w-full ml-4"
        v-model="aiOutput"
        :placeholder="aiOutput ? aiOutput : 'AI Output'"
        :rows="5"
        :loading="isGenerating"
        :loading-text="isGenerating ? 'Generating...' : 'AI Output'"
        readonly
      />
    </div>
    <div class="grid grid-cols-2 gap-4 mb-10">
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Battery Voltage</h2>
        </template>
        <BaseChart
          :data="{
            labels: battery_statuses.map((status) =>
              new Date(status.created_at).toLocaleTimeString()
            ),
            datasets: [
              {
                label: 'Current Consumed',
                data: battery_statuses.map((status) => status.current_consumed),
                backgroundColor: ['#FF6384'],
              },
              {
                label: 'Energy Consumed',
                data: battery_statuses.map((status) => status.energy_consumed),
                backgroundColor: ['#36A2EB'],
              },
              {
                label: 'Current Battery',
                data: battery_statuses.map((status) => status.current_battery),
                backgroundColor: ['#4BC0C0'],
              },
            ],
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }"
          type="line"
        />
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Attitude</h2>
        </template>
        <BaseChart
          :data="{
            labels: attitudes.map((status) =>
              new Date(status.created_at).toLocaleTimeString()
            ),
            datasets: [
              {
                label: 'Roll',
                data: attitudes.map((status) => status.roll),
                backgroundColor: ['#FF6384'],
              },
              {
                label: 'Pitch',
                data: attitudes.map((status) => status.pitch),
                backgroundColor: ['#36A2EB'],
              },
              {
                label: 'Yaw',
                data: attitudes.map((status) => status.yaw),
                backgroundColor: ['#FFCE56'],
              },
            ],
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }"
          type="line"
        />
      </UCard>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-10">
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Temperature mC</h2>
        </template>
        <BaseChart
          :data="{
            labels: scaled_pressures.map((status) =>
              new Date(status.created_at).toLocaleTimeString()
            ),
            datasets: [
              {
                label: 'Pressure',
                data: scaled_pressures.map((status) => status.press_abs),
                backgroundColor: ['#36A2EB'],
              },
              {
                label: 'Pressure Difference',
                data: scaled_pressures.map((status) => status.press_abs),
                backgroundColor: ['#FFCE56'],
              },
            ],
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }"
          type="line"
        />
      </UCard>
      <UCard variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold">Depth Sensor cm</h2>
        </template>
        <BaseChart
          :data="{
            labels: distances.map((status) =>
              new Date(status.created_at).toLocaleTimeString()
            ),
            datasets: [
              {
                label: 'Current Depth',
                data: distances.map((status) => status.current_distance),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
              {
                label: 'Min Depth',
                data: distances.map((status) => status.min_distance),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
              {
                label: 'Max Depth',
                data: distances.map((status) => status.max_distance),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }"
          type="line"
        />
      </UCard>
      <UCard variant="subtle" class="col-span-2">
        <template #header>
          <h2 class="text-xl font-bold">Boat Location</h2>
        </template>

        <LMap
          style="height: 400px"
          :zoom="6"
          :center="[location.lat, location.lon]"
          :use-global-leaflet="false"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <LMarker :lat-lng="[location.lat, location.lon]" />
        </LMap>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import parameteres from "~/assets/mavlink.json";
import BaseChart from "~/components/BaseChart.vue";
import type {
  Distance,
  battery_status,
  Navigation,
  Location,
  SCALED_PRESSURE,
  Attitude,
} from "~/server/types/interfaces";

const config = useRuntimeConfig();

const distances = ref<Distance[]>([]);
const battery_statuses = ref<battery_status[]>([]);
const locations = ref<Location[]>([]);
const navigations = ref<Navigation[]>([]);
const scaled_pressures = ref<SCALED_PRESSURE[]>([]);
const attitudes = ref<Attitude[]>([]);
const isFetching = ref(false);
const aiOutput = ref<string | null>(null);
const isGenerating = ref(false);
let intervalId: NodeJS.Timeout | null = null;

const generate = async () => {
  isGenerating.value = true;
  aiOutput.value = null;
  try {
    const response: any = await $fetch("/api/generate_insights", {
      method: "POST",
      body: {
        distances: distances.value,
        battery_statuses: battery_statuses.value,
        locations: locations.value,
        navigations: navigations.value,
        scaled_pressures: scaled_pressures.value,
        attitudes: attitudes.value,
      },
    });
    aiOutput.value =
      response?.result || response?.error || "No response from AI.";
  } catch (error: any) {
    aiOutput.value =
      error?.data?.error || error.message || "Failed to generate insights.";
    console.error("Error generating response:", error);
  } finally {
    isGenerating.value = false;
  }
};

const fetchAllData = async () => {
  const res: any = await $fetch("/api/all_data", { method: "GET" });
  distances.value = [...res.data.distance_sensor];
  battery_statuses.value = [...res.data.battery_status];
  locations.value = [...res.data.location];
  navigations.value = [...res.data.navigation];
  scaled_pressures.value = [...res.data.scaled_pressure];
  attitudes.value = [...res.data.attitude];
};

const toggleFetching = () => {
  isFetching.value = !isFetching.value;
  if (isFetching.value) {
    fetchAllData();
    intervalId = setInterval(fetchAllData, 1000);
  } else if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  fetchAllData();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

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
    lon: GPS_RAW_INT.message.lon,
  };
  const res = await $fetch("/api/location", {
    method: "POST",
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
  const res = await $fetch("/api/battery_status", {
    method: "POST",
    body: battery_status,
  });
}
</script>

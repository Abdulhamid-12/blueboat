import { serverSupabaseClient } from "#supabase/server";

interface battery_status {
    vehicle_id: number;
    current_consumed: number;
    energy_consumed: number;
    temperature: number;
    voltages: number[];
    current_battery: number;
};

function isBatteryStatus(obj: any): obj is battery_status {
  const allowedKeys = ["vehicle_id", "current_consumed", "energy_consumed", "temperature", "voltages", "current_battery"];
  return (
    obj &&
    typeof obj.vehicle_id === "number" &&
    typeof obj.current_consumed === "number" &&
    typeof obj.energy_consumed === "number" &&
    typeof obj.temperature === "number" &&
    Array.isArray(obj.voltages) &&
    obj.voltages.every((v: any) => typeof v === "number") &&
    typeof obj.current_battery === "number" &&
    Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
    Object.keys(obj).length === allowedKeys.length
  );
};

export default eventHandler(async (event) => {
  
  if (event.method === "POST") {
    const body = await readBody(event);
    // Validate the body
    if (!isBatteryStatus(body)) {
      setResponseStatus(event, 400);
      return { error: "Invalid request body" };
    };
    const client = await serverSupabaseClient(event);
    const { data, error } = await client.from("battery_status").insert(body as any).select().single();
    if (error)  { 
      setResponseStatus(event, 500); 
      return { error }; 
    };
    return { data };
  }

  return setResponseStatus(event, 405); // Method Not Allowed

});
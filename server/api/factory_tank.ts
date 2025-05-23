import { serverSupabaseClient } from "#supabase/server";
import { FactoryTank } from "../types/interfaces";

function isFactoryTank(obj: any): obj is FactoryTank {
  const allowedKeys = [
    "flow_in",
    "flow_out",
    "pump1_status",
    "pump1_power",
    "pump1_vibration",
    "pump1_temp",
    "tank_level",
    "valve_fill",
    "valve_discharge",
    "voltage",
    "anomaly_triggered"
  ];
  return (
    obj &&
    typeof obj.flow_in === "number" &&
    typeof obj.flow_out === "number" &&
    typeof obj.pump1_status === "boolean" &&
    typeof obj.pump1_power === "number" &&
    typeof obj.pump1_vibration === "number" &&
    typeof obj.pump1_temp === "number" &&
    typeof obj.tank_level === "number" &&
    typeof obj.valve_fill === "boolean" &&
    typeof obj.valve_discharge === "boolean" &&
    typeof obj.voltage === "number" &&
    typeof obj.anomaly_triggered === "boolean" && 
    Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
    Object.keys(obj).length === allowedKeys.length
  );
};

export default eventHandler(async (event) => {
  
  if (event.method === "POST") {
    const body = await readBody(event);
    // Validate the body
    if (!isFactoryTank(body)) {
      setResponseStatus(event, 400);
      return { error: "Invalid request body" };
    };
    const client = await serverSupabaseClient(event);
    const { data, error } = await client.from("factory_tank").insert(body as any).select().single();
    if (error)  { 
      setResponseStatus(event, 500); 
      return { error }; 
    };
    return { data };
  }

  return setResponseStatus(event, 405); // Method Not Allowed

});
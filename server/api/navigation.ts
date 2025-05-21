import { serverSupabaseClient } from "#supabase/server";

interface Navigation {
    vehicle_id: number;
    airspeed: number;
    groundspeed: number;
    climb: number;
    heading: number;
    throttle: number;
};

function isNavigation(obj: any): obj is Navigation {
  const allowedKeys = ["vehicle_id", "airspeed", "groundspeed", "climb", "heading", "throttle"];
  return (
    obj &&
    typeof obj.vehicle_id === "number" &&
    typeof obj.airspeed === "number" &&
    typeof obj.groundspeed === "number" &&
    typeof obj.climb === "number" &&
    typeof obj.heading === "number" &&
    typeof obj.throttle === "number" &&
    Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
    Object.keys(obj).length === allowedKeys.length
  );
};

export default eventHandler(async (event) => {
  
  if (event.method === "POST") {
    const body = await readBody(event);
    // Validate the body
    if (!isNavigation(body)) {
      setResponseStatus(event, 400);
      return { error: "Invalid request body" };
    };
    const client = await serverSupabaseClient(event);
    const { data, error } = await client.from("vfr_hud").insert(body as any).select().single();
    if (error)  { 
      setResponseStatus(event, 500); 
      return { error }; 
    };
    return { data };
  }

  return setResponseStatus(event, 405); // Method Not Allowed

});
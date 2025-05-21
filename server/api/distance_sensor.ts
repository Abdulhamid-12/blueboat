import { serverSupabaseClient } from "#supabase/server";

interface Distance {
    vehicle_id: number;
    min_distance: number;
    max_distance: number;
    current_distance: number;
};

function isDistance(obj: any): obj is Distance {
  const allowedKeys = ["vehicle_id", "min_distance", "max_distance", "current_distance"];
  return (
    obj &&
    typeof obj.vehicle_id === "number" &&
    typeof obj.min_distance === "number" &&
    typeof obj.max_distance === "number" &&
    typeof obj.current_distance === "number" &&
    Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
    Object.keys(obj).length === allowedKeys.length
  );
};

export default eventHandler(async (event) => {
  
  if (event.method === "POST") {
    const body = await readBody(event);
    // Validate the body
    if (!isDistance(body)) {
      setResponseStatus(event, 400);
      return { error: "Invalid request body" };
    };
    const client = await serverSupabaseClient(event);
    const { data, error } = await client.from("distance_sensor").insert(body as any).select().single();
    if (error)  { 
      setResponseStatus(event, 500); 
      return { error }; 
    };
    return { data };
  }

  return setResponseStatus(event, 405); // Method Not Allowed

});
import { serverSupabaseClient } from "#supabase/server";

interface Location {
    vehicle_id: number;
    lat: number;
    lon: number;
};

function isLocation(obj: any): obj is Location {
  const allowedKeys = ["vehicle_id", "lat", "lon"];
  return (
    obj &&
    typeof obj.vehicle_id === "number" &&
    typeof obj.lat === "number" &&
    typeof obj.lon === "number" &&
    Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
    Object.keys(obj).length === allowedKeys.length
  );
};

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  if (event.method === "POST") {
    const body = await readBody(event);
    // Validate the body
    if (!isLocation(body)) {
      setResponseStatus(event, 400);
      return { error: "Invalid request body" };
    };
    const { data, error } = await client.from("location").insert(body as any).select().single();
    if (error)  { 
      setResponseStatus(event, 500); 
      return { error }; 
    };
    return { data };
  }

  return setResponseStatus(event, 405); // Method Not Allowed

  // GET all location
//   const { data, error } = await client.from("location").select("*");
//   if (error) return { error };
//   return { data };
});
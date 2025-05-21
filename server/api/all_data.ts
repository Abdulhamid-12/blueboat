import { serverSupabaseClient } from "#supabase/server";

function isAllowedKeys(obj: any) {
    const allowedKeys = ["distance_sensor", "battery_status", "location", "navigation", "attitude", "scaled_pressure"];
    return (
        obj &&
        Object.keys(obj).every((key) => allowedKeys.includes(key)) &&
        Object.keys(obj).length === allowedKeys.length
    );
};

export default eventHandler(async (event) => {
    // Set CORS headers for all responses
    event.res.setHeader("Access-Control-Allow-Origin", "*");
    event.res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    event.res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (event.method === "OPTIONS") {
        // Respond to preflight request
        setResponseStatus(event, 204); // No Content
        return "";
    }

    if (event.method === "POST") {
        const body = await readBody(event);
        // Validate the body
        if (!isAllowedKeys(body)) {
            setResponseStatus(event, 400);
            return { error: "Invalid request body" };
        }

        const client = await serverSupabaseClient(event);
        const insertPromises = Object.keys(body).map(async (key) => {
            const { data, error } = await client.from(key).insert(body[key] as any).select().single();
            return { key, data, error };
        });
        const insertResults = await Promise.all(insertPromises);
        const results: Record<string, any> = {};
        const errors: Record<string, any> = {};
        for (const result of insertResults) {
            if (result.error) {
                errors[result.key] = result.error;
            } else {
                results[result.key] = result.data;
            }
        }
        if (Object.keys(errors).length > 0) {
            setResponseStatus(event, 400);
            return { error: errors, data: results };
        }
        return { data: results };
    }

    else if (event.method === "GET") {
        const client = await serverSupabaseClient(event);
        const tableNames = [
            "distance_sensor",
            "battery_status",
            "location",
            "navigation",
            "attitude",
            "scaled_pressure"
        ];
        const fetchPromises = tableNames.map(async (table) => {
            const { data, error } = await client.from(table).select("*").order('created_at', { ascending: false }).limit(20);
            return { table, data: (data || []).reverse(), error };
        });
        const fetchResults = await Promise.all(fetchPromises);
        const result: Record<string, any[]> = {};
        const errors: Record<string, any> = {};
        for (const { table, data, error } of fetchResults) {
            if (error) {
                errors[table] = error;
            } else {
                result[table] = data;
            }
        }
        if (Object.keys(errors).length > 0) {
            setResponseStatus(event, 500);
            return { error: errors, data: result };
        }
        return { data: result };
    }

    return setResponseStatus(event, 405); // Method Not Allowed

});
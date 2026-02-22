import { createClient } from "@supabase/supabase-js";
// import { db } from "@packages/database/src/db.ts";

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );

      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, ""); // remove trailing slash

      // ===============================
      // GET /hospitals
      // ===============================
      if (path === "/hospitals" && request.method === "GET") {
        const { data, error } = await supabase
          .from("hospitals")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          return Response.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return Response.json({ success: true, data });
      }

      // ===============================
      // POST /hospitals
      // ===============================
      if (path === "/hospitals" && request.method === "POST") {
        let body: any;

        try {
          body = await request.json();
        } catch {
          return Response.json(
            { success: false, error: "Invalid JSON body" },
            { status: 400 }
          );
        }

        const { name, address, city } = body;

        if (!name) {
          return Response.json(
            { success: false, error: "Hospital name is required" },
            { status: 400 }
          );
        }

        const { data, error } = await supabase
          .from("hospitals")
          .insert([{ name, address, city }])
          .select();

        if (error) {
          return Response.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return Response.json({ success: true, data });
      }

      // ===============================
      // Default Route
      // ===============================
      return new Response("Not Found", { status: 404 });

    } catch (err: any) {
      return Response.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
  }
};

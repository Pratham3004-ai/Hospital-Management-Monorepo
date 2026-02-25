import { createClient } from "@supabase/supabase-js";

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      // ===============================
      // ✅ Validate ENV Variables
      // ===============================
      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Supabase environment variables are missing"
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );

      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "");
      const method = request.method.toUpperCase();

      const jsonResponse = (body: any, status = 200) =>
        new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" }
        });

      // ===============================
      // ✅ HEALTH CHECK ROUTE
      // ===============================
      if (path === "/health" && method === "GET") {
        return jsonResponse({
          success: true,
          message: "Server is running properly"
        });
      }

      // =====================================================
      // ================= HOSPITALS =========================
      // =====================================================

      if (path === "/hospitals" && method === "GET") {
        const { data, error } = await supabase
          .from("hospitals")
          .select("*")
          .order("created_at", { ascending: false });

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path === "/hospitals" && method === "POST") {
        const body = (await request.json().catch(() => null)) as {
          name?: string;
          address?: string;
          city?: string;
        } | null;

        if (!body?.name)
          return jsonResponse(
            { success: false, error: "Hospital name required" },
            400
          );

        const { name, address, city } = body;

        const { data, error } = await supabase
          .from("hospitals")
          .insert([{ name, address, city }])
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/hospitals/") && method === "PUT") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const body = (await request.json().catch(() => null)) as Record<string, any> | null;
        if (!body)
          return jsonResponse({ success: false, error: "Invalid body" }, 400);

        const { data, error } = await supabase
          .from("hospitals")
          .update(body)
          .eq("id", id)
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/hospitals/") && method === "DELETE") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const { error } = await supabase
          .from("hospitals")
          .delete()
          .eq("id", id);

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, message: "Hospital deleted" });
      }

      // =====================================================
      // ================= DOCTORS ===========================
      // =====================================================

      if (path === "/doctors" && method === "GET") {
        const { data, error } = await supabase.from("doctors").select("*");

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path === "/doctors" && method === "POST") {
        const body = (await request.json().catch(() => null)) as {
          hospital_id?: string;
          name?: string;
          specialization?: string;
          available?: boolean;
        } | null;

        if (!body?.hospital_id || !body?.name || !body?.specialization)
          return jsonResponse(
            { success: false, error: "Missing required fields" },
            400
          );

        const { hospital_id, name, specialization, available } = body;

        const { data, error } = await supabase
          .from("doctors")
          .insert([{ hospital_id, name, specialization, available }])
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/doctors/") && method === "PUT") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const body = (await request.json().catch(() => null)) as Record<string, any> | null;
        if (!body)
          return jsonResponse({ success: false, error: "Invalid body" }, 400);

        const { data, error } = await supabase
          .from("doctors")
          .update(body)
          .eq("id", id)
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/doctors/") && method === "DELETE") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const { error } = await supabase
          .from("doctors")
          .delete()
          .eq("id", id);

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, message: "Doctor deleted" });
      }

      // =====================================================
      // ================= PATIENTS ==========================
      // =====================================================

      if (path === "/patients" && method === "GET") {
        const { data, error } = await supabase.from("patients").select("*");

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path === "/patients" && method === "POST") {
        const body = (await request.json().catch(() => null)) as {
          full_name?: string;
          phone?: string;
        } | null;

        if (!body?.full_name)
          return jsonResponse(
            { success: false, error: "Full name required" },
            400
          );

        const { full_name, phone } = body;

        const { data, error } = await supabase
          .from("patients")
          .insert([{ full_name, phone }])
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/patients/") && method === "DELETE") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const { error } = await supabase
          .from("patients")
          .delete()
          .eq("id", id);

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, message: "Patient deleted" });
      }

      // =====================================================
      // ================= APPOINTMENTS ======================
      // =====================================================

      if (path === "/appointments" && method === "GET") {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            doctors(name, specialization),
            patients(full_name)
          `);

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path === "/appointments" && method === "POST") {
        const body = (await request.json().catch(() => null)) as {
          doctor_id?: string;
          patient_id?: string;
          appointment_date?: string;
        } | null;

        if (!body?.doctor_id || !body?.patient_id || !body?.appointment_date)
          return jsonResponse(
            { success: false, error: "Missing required fields" },
            400
          );

        const { doctor_id, patient_id, appointment_date } = body;

        const { data, error } = await supabase
          .from("appointments")
          .insert([{ doctor_id, patient_id, appointment_date }])
          .select();

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, data });
      }

      if (path.startsWith("/appointments/") && method === "DELETE") {
        const id = path.split("/")[2];
        if (!id)
          return jsonResponse({ success: false, error: "Invalid ID" }, 400);

        const { error } = await supabase
          .from("appointments")
          .delete()
          .eq("id", id);

        if (error)
          return jsonResponse({ success: false, error: error.message }, 500);

        return jsonResponse({ success: true, message: "Appointment deleted" });
      }

      // =====================================================
      return new Response("Not Found", { status: 404 });

    } catch (err: any) {
      return new Response(
        JSON.stringify({
          success: false,
          error: err?.message || "Unexpected error occurred"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
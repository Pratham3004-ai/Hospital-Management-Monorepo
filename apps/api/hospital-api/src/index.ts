import { createClient } from "@supabase/supabase-js";

export default {
  async fetch(request: Request, env: any): Promise<Response> {

    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .limit(1);

    if (error) {
      return Response.json({
        success: false,
        error
      });
    }

    return Response.json({
      success: true,
      message: "Supabase connected successfully ✅",
      data
    });
  }
};

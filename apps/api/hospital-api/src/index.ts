import { slugify } from "@template/utils";
import type { ApiResponse } from "@template/types";

export default {
  async fetch(): Promise<Response> {
    const value = slugify("Template API Worker: hospital-api");

    const body: ApiResponse<string> = {
      success: true,
      data: value
    };

    return Response.json(body);
  }
};

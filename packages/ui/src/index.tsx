import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

/* -------------------------------
   Shared StudioVault Form Schema
-------------------------------- */

export const EmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type EmailForm = z.infer<typeof EmailSchema>;

/* -------------------------------
   Shared Component
-------------------------------- */

export function EmailCapture(props: {
  onSubmit: (data: EmailForm) => void;
}) {
  const form = useForm<EmailForm>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid black",
        maxWidth: 320,
      }}
    >
      <h3>Shared UI Stress Form</h3>

      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          placeholder="Enter email"
          {...form.register("email")}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid gray",
          }}
        />

        {form.formState.errors.email && (
          <p style={{ color: "red" }}>
            {form.formState.errors.email.message}
          </p>
        )}

        <button type="submit">Submit</button>
      </form>
    </motion.div>
  );
}

import { z } from "astro/zod";

export const OptionsSchema = z.object({
	applyBaseStyles: z.boolean().default(true),
});
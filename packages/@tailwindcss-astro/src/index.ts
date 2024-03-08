import tailwindcss from "@tailwindcss/vite";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { addVitePluginPlugin } from "astro-integration-kit/plugins";
import { OptionsSchema } from "./schema";
import { injectDevRoutePlugin } from 'astro-integration-kit/plugins'; // Adjust the import path as necessary

export interface InjectScript {
 (stage: InjectedScriptStage, script: string): void;
}



export interface Logger {
	info: (message: string) => void;
	warn: (message: string) => void;
	error: (message: string) => void;
	// Add other methods as needed
   }

   export interface VitePlugin {
	name: string;
   }

   export interface InjectScript {
    (key: string, script: string): void;
}

export default defineIntegration({
	name: "tailwindcss",
	plugins: [addVitePluginPlugin],
	optionsSchema: OptionsSchema,
	setup: ({ name, options }) => {
		return {
			"astro:config:setup": ({ logger, addVitePlugin, injectScript }: { logger: Logger; addVitePlugin: (plugin: VitePlugin) => void; injectScript: InjectScript }) => {
				const { resolve } = createResolver(import.meta.url);

				const plugins = tailwindcss();

				for (const plugin of plugins) {
					addVitePlugin(plugin);
				}

				if (options.applyBaseStyles) {
					injectScript("page-ssr", `import "${resolve("./base.css")}";`);
				}

				logger.info("Loaded");
			},
		};
	},
});
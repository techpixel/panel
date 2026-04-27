import type { Plugin } from '@panel/plugin-sdk';

/**
 * Build-time auto-discovery of installed widget packages.
 *
 * Vite's `import.meta.glob` scans the monorepo for any `packages/widget-*\/src/index.ts`
 * and inlines them as eager imports at build time. Their default export must be the
 * `Plugin` produced by `definePlugin()` from `@panel/plugin-sdk`.
 *
 * To install a new widget:
 *   1. Drop a `@panel/widget-foo` package under `packages/` (or install one from npm
 *      and add it to this app's deps).
 *   2. Run `pnpm install` and restart the dev server.
 *
 * The widget appears in `installedPlugins` automatically — no edit to this file
 * (or any other app source) required for discovery itself. Screens still need to
 * import widget components directly to render them with full type-safety.
 */
const modules = import.meta.glob<{ default: Plugin }>(
	'../../../../packages/widget-*/src/index.ts',
	{ eager: true }
);

export const installedPlugins: Plugin[] = Object.values(modules)
	.map((m) => m.default)
	.filter(Boolean);

export const pluginById: Record<string, Plugin> = Object.fromEntries(
	installedPlugins.map((p) => [p.manifest.id, p])
);

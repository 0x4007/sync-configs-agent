import yaml from "js-yaml";

type PluginLocation = string | { owner: string; repo: string; ref?: string };

export function parsePluginUrls(yamlContent: string): PluginLocation[] {
  const parsedYaml = yaml.load(yamlContent) as { plugins?: unknown[] };
  const plugins = parsedYaml.plugins || [];
  if (!plugins.length) {
    console.error("parsedYaml.plugins not found in the YAML content", parsedYaml);
  }
  return plugins.flatMap((plugin) => parsePlugin(plugin));
}

function parsePlugin(plugin: unknown): PluginLocation[] {
  if (typeof plugin !== "object" || plugin === null || !("uses" in plugin)) {
    return [];
  }

  const uses = plugin.uses;
  if (!Array.isArray(uses)) {
    return [];
  }

  return uses.flatMap((use) => parseUse(use));
}

function parseUse(use: unknown): PluginLocation[] {
  if (typeof use === "string") {
    return [use];
  }

  if (typeof use === "object" && use !== null && "plugin" in use) {
    return parsePluginString(use.plugin);
  }

  return [];
}

function parsePluginString(plugin: unknown): PluginLocation[] {
  if (typeof plugin !== "string") {
    return [];
  }

  if (plugin.startsWith("http")) {
    return [`${plugin}/manifest.json`];
  }

  const [owner, repoAndRef] = plugin.split("/");
  const [repo, ref] = repoAndRef.split("@");
  return [{ owner, repo, ref }];
}

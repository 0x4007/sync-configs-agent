type Manifest = {
  name: string;
  description?: string;
  commands?: Record<string, { description: string; "ubiquity:example": string }>;
  "ubiquity:listeners"?: string[];
  configuration?: Record<string, unknown>;
};

const _manifestCache: Record<string, Manifest> = {};
type PluginLocation = string | { owner: string; repo: string; ref?: string };
export async function fetchManifests(plugins: PluginLocation[]): Promise<Manifest[]> {
  const manifests: Manifest[] = [];

  for (const plugin of plugins) {
    const manifest = await fetchManifest(plugin);
    if (manifest) {
      manifests.push(manifest);
    }
  }

  return manifests;
}

async function fetchManifest(plugin: PluginLocation): Promise<Manifest | null> {
  const url = typeof plugin === "string" ? plugin : `https://raw.githubusercontent.com/${plugin.owner}/${plugin.repo}/${plugin.ref || "main"}/manifest.json`;

  if (_manifestCache[url]) {
    return _manifestCache[url];
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    const manifest = decodeManifest(JSON.parse(content));
    _manifestCache[url] = manifest;
    return manifest;
  } catch (e) {
    console.warn(`Could not fetch manifest for ${url}: ${e}`);
  }

  return null;
}

function decodeManifest(manifest: unknown): Manifest {
  if (typeof manifest !== "object" || manifest === null) {
    throw new Error("Manifest is invalid: not an object");
  }

  const typedManifest = manifest as Partial<Manifest>;

  if (typeof typedManifest.name !== "string" || typedManifest.name.length === 0) {
    throw new Error("Manifest is invalid: name is required and must be a non-empty string");
  }

  return {
    name: typedManifest.name,
    description: typedManifest.description || "",
    commands: typedManifest.commands || {},
    "ubiquity:listeners": typedManifest["ubiquity:listeners"] || [],
    configuration: typedManifest.configuration || {},
  };
}

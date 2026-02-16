# Package Setup Manifest

Each package can define a `setup` field in its `package.json` to specify how files should be merged or created in the user's project.

## Setup Object Schema

```json
{
  "setup": {
    "target-file.ts": {
      "strategy": "create" | "merge" | "skip",
      "mergeType": "append" | "prepend" | "replace",
      "exports": ["namedExport1", "namedExport2"],
      "description": "What this file does"
    }
  }
}
```

## Strategies

| Strategy | Description |
|----------|-------------|
| `create` | Create file if it doesn't exist |
| `merge` | Merge with existing file |
| `skip` | Don't touch existing file |

## Merge Types

| MergeType | Description |
|-----------|-------------|
| `append` | Add imports/exports to end |
| `prepend` | Add imports to beginning |
| `replace` | Replace entire file (careful!) |

## Examples

### Adding hooks.server.ts

```json
{
  "setup": {
    "src/hooks.server.ts": {
      "strategy": "merge",
      "mergeType": "append",
      "exports": ["authHooks"],
      "description": "Add auth hooks to handle function"
    }
  }
}
```

### Adding to svelte.config.js

```json
{
  "setup": {
    "svelte.config.js": {
      "strategy": "patch",
      "pattern": "kit: {",
      "patch": "kit: { adapter: adapter() },",
      "description": "Add adapter configuration"
    }
  }
}
```

## File Types Supported

- `.ts` / `.tsx` - TypeScript (merge imports/exports)
- `.svelte` - Svelte components
- `.json` - JSON (deep merge)
- `.js` - JavaScript
- `.nix` - Nix expressions

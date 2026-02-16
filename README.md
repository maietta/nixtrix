# NixTrix — SvelteKit Component Library

A component package manager for SvelteKit. Build your site from a menu of pre-built components, pull updates anytime.

## Features

- **Component-based**: Choose from pre-built components (auth, CMS, layouts, UI)
- **Base template**: Start with a solid SvelteKit foundation
- **Add components**: Pull in features with a command
- **Stay updated**: Update individual components or all at once
- **Reproducible**: Full Nix flake setup with pinned dependencies

## Quick Start

```bash
# Initialize a new project from base template
nix flake init -t github:maietta/NixTrix#base
```

## Workflow

### 1. Initialize Project

```bash
nix flake init -t github:maietta/NixTrix#base
cd my-project
nix develop
```

### 2. Add Components

```bash
# Add a component to your project
nix run github:maietta/NixTrix#add -- sticky-header

# Add multiple components
nix run github:maietta/NixTrix#add -- sticky-header sidebar contact-form
```

### 3. Update Components

```bash
# Update all components to latest
nix run github:maietta/NixTrix#update

# Update specific component
nix run github:maietta/NixTrix#update -- sticky-header
```

## Available Components

| Component | Description |
|-----------|-------------|
| `sticky-header` | Fixed header with navigation |
| `sidebar` | Collapsible sidebar navigation |
| `contact-form` | Ready-to-use contact form |
| `auth` | Login/logout functionality (coming soon) |
| `cms` | CMS integration (coming soon) |

## Project Structure

```
your-project/
├── flake.nix              # Your flake with NixTrix input
├── src/
│   └── lib/
│       └── components/   # Components pulled from NixTrix
├── src/routes/           # Your pages
└── ...
```

## Using Components in Pages

Import components from `$lib/components/`:

```svelte
<script>
  import StickyHeader from '$lib/components/sticky-header/+page.svelte';
  import Sidebar from '$lib/components/sidebar/+page.svelte';
</script>

<StickyHeader />
<Sidebar />
<main>
  <slot />
</main>
```

## Configuration

In your `flake.nix`:

```nix
{
  inputs.NixTrix.url = "github:maietta/NixTrix";
  
  outputs = { self, NixTrix }: {
    packages.x86_64-linux.default = NixTrix.lib.mkSvelteProject {
      selectedComponents = [
        "sticky-header"
        "contact-form"
      ];
    };
  };
}
```

## Requirements

- Nix with flakes enabled
- Node.js (provided via dev shell)
- pnpm (recommended)

## Development

```bash
# Enter development shell
nix develop

# Build the project
nix build
```

## License

MIT

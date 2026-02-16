# NixTrix — SvelteKit Package Manager

A package manager for SvelteKit. Build your site from pre-built packages — components, routes, and libraries — pull updates anytime.

## Features

- **Packages**: Pre-built components, routes, and libraries
- **Base template**: Start with a solid SvelteKit foundation
- **Add packages**: Pull in features with a command
- **Remove packages**: Take out features you no longer need
- **Stay updated**: Update individual packages or all at once
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

### 2. Add Packages

```bash
# Add a component (UI piece)
nix run github:maietta/NixTrix#add -- sticky-header

# Add a route (full page with logic)
nix run github:maietta/NixTrix#add --route blog

# Add a library (auth, CMS, utils)
nix run github:maietta/NixTrix#add --lib auth

# Add multiple packages
nix run github:maietta/NixTrix#add -- sticky-header sidebar --route blog
```

### 3. Update Packages

```bash
# Update all packages to latest
nix run github:maietta/NixTrix#update

# Update specific package
nix run github:maietta/NixTrix#update -- sticky-header
```

### 4. Remove Packages

```bash
# Remove a package from your project
nix run github:maietta/NixTrix#remove -- sticky-header
```

## Package Types

| Type | Flag | Destination |
|------|------|-------------|
| **Components** | `--component` (default) | `src/lib/components/` |
| **Routes** | `--route` | `src/routes/` |
| **Libraries** | `--lib` | `src/lib/` |

## Available Packages

### Components

| Package | Description |
|---------|-------------|
| `sticky-header` | Fixed header with navigation |
| `sidebar` | Collapsible sidebar navigation |
| `contact-form` | Ready-to-use contact form |

### Routes

| Package | Description |
|---------|-------------|
| `blog` | Blog with posts, archives (coming soon) |
| `dashboard` | Admin dashboard (coming soon) |
| `forum` | Discussion forum (coming soon) |

### Libraries

| Package | Description |
|---------|-------------|
| `auth` | Login/logout functionality (coming soon) |
| `cms` | CMS integration (coming soon) |

## Project Structure

```
your-project/
├── flake.nix              # Your flake with NixTrix input
├── src/
│   ├── lib/
│   │   ├── components/   # UI components
│   │   └── */            # Libraries (auth, cms, utils)
│   └── routes/
│       └── */            # Full page routes
└── ...
```

## Using Packages

### Components

Import from `$lib/components/`:

```svelte
<script>
  import StickyHeader from '$lib/components/sticky-header/+page.svelte';
</script>

<StickyHeader />
```

### Routes

Routes are automatically available at `/blog`, `/dashboard`, etc.

### Libraries

Import from `$lib/`:

```svelte
<script>
  import { user } from '$lib/auth/user';
</script>

{#if $user}
  <p>Welcome, {$user.name}</p>
{/if}
```

## Configuration

In your `flake.nix`:

```nix
{
  inputs.NixTrix.url = "github:maietta/NixTrix";
  
  outputs = { self, NixTrix }: {
    packages.x86_64-linux.default = NixTrix.lib.mkSvelteProject {
      selectedPackages = [
        { type = "component"; name = "sticky-header"; }
        { type = "component"; name = "contact-form"; }
        { type = "route"; name = "blog"; }
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

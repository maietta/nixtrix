# NixTrix Development Guidelines

## Svelte 5 Runes

**Always use Svelte 5 runes** for all Svelte components:
- Use `$props()` instead of `export let`
- Use `$state()` instead of `let` for reactive variables
- Use `$derived()` instead of `$:` reactive statements
- Use `$effect()` instead of `onMount`/`afterUpdate` for side effects
- Use `$derived.by()` for complex derived values

## Project Structure

- `src/lib/packages/` - Package definitions (components, libs, routes)
- `playground/` - Test site for validating packages
- `templates/base/` - Base SvelteKit template for users

## Commands

```bash
# Test packages in playground
cd playground && bun dev
```

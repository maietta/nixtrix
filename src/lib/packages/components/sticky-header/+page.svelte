<script lang="ts">
  let { title = 'My Site' } = $props();
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-14 items-center">
    <a href="/" class="mr-6 flex items-center space-x-2">
      <span class="font-bold">{title}</span>
    </a>
    <nav class="flex items-center space-x-6 text-sm font-medium">
      <a href="/" class="transition-colors hover:text-foreground/80">Home</a>
      <a href="/about" class="transition-colors hover:text-foreground/80">About</a>
      <a href="/contact" class="transition-colors hover:text-foreground/80">Contact</a>
    </nav>
  </div>
</header>

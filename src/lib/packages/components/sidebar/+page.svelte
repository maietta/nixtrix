<script lang="ts">
  let { 
    items = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ],
    collapsible = false
  } = $props();
  
  let open = $state(false);
</script>

<aside class="w-64 border-r bg-card h-screen sticky top-0 p-4">
  <nav class="space-y-2">
    {#each items as item}
      <a 
        href={item.href}
        class="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
      >
        {item.label}
      </a>
    {/each}
  </nav>
</aside>

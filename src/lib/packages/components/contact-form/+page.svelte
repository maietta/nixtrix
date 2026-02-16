<script lang="ts">
  let { 
    endpoint = '/api/contact',
    buttonText = 'Send Message'
  } = $props();

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    status = 'sending';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      
      if (res.ok) {
        status = 'success';
        name = '';
        email = '';
        message = '';
      } else {
        status = 'error';
      }
    } catch {
      status = 'error';
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4 max-w-md">
  <div>
    <label for="name" class="block text-sm font-medium mb-1">Name</label>
    <input
      id="name"
      type="text"
      bind:value={name}
      required
      class="w-full px-3 py-2 border rounded-md"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium mb-1">Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      class="w-full px-3 py-2 border rounded-md"
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium mb-1">Message</label>
    <textarea
      id="message"
      bind:value={message}
      required
      rows="4"
      class="w-full px-3 py-2 border rounded-md"
    ></textarea>
  </div>
  
  <button
    type="submit"
    disabled={status === 'sending'}
    class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
  >
    {status === 'sending' ? 'Sending...' : buttonText}
  </button>
  
  {#if status === 'success'}
    <p class="text-green-600">Message sent successfully!</p>
  {:else if status === 'error'}
    <p class="text-red-600">Failed to send message. Please try again.</p>
  {/if}
</form>

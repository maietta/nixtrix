<script lang="ts">
	let { data } = $props();
</script>

<h1>Blog</h1>

<ul>
	{#each data.posts as post}
		<li>
			<a href="/blog/{post.slug}">{post.title}</a>
			{#if post.excerpt}
				<p>{post.excerpt}</p>
			{/if}
			<time>{new Date(post.published_at).toLocaleDateString()}</time>
		</li>
	{:else}
		<li>No posts yet.</li>
	{/each}
</ul>

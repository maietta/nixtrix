<script lang="ts">
	let { data } = $props();
</script>

<article>
	<h1>{data.post.title}</h1>
	<time>{new Date(data.post.published_at).toLocaleDateString()}</time>
	<div>{@html data.post.content}</div>
</article>

<a href="/blog">← Back to blog</a>

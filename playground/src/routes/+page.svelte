<script lang="ts">
	import StickyHeader from '@packages/components/sticky-header/+page.svelte';
	import Sidebar from '@packages/components/sidebar/+page.svelte';
	import ContactForm from '@packages/components/contact-form/+page.svelte';
</script>

<StickyHeader />

<main>
	<h1>NixTrix Playground</h1>
	<p>Test your packages here</p>

	<section>
		<h2>Sidebar</h2>
		<Sidebar />
	</section>

	<section>
		<h2>Contact Form</h2>
		<ContactForm />
	</section>
</main>

<style>
	main {
		padding: 2rem;
	}
	section {
		margin: 2rem 0;
	}
</style>

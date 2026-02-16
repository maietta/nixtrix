import { getPostBySlug } from '../../schema';
import { error } from '@sveltejs/kit';

export function load({ params }: { params: { slug: string } }) {
	const post = getPostBySlug(params.slug);
	
	if (!post) {
		throw error(404, 'Post not found');
	}
	
	return {
		post
	};
}

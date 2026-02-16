import { getAllPosts } from '../../schema';

export function load() {
	return {
		posts: getAllPosts()
	};
}

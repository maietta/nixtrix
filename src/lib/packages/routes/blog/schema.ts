import { Database } from 'bun:sqlite';

export interface Post {
	id: number;
	slug: string;
	title: string;
	content: string;
	excerpt: string | null;
	published_at: string;
	created_at: string;
	updated_at: string;
}

const dbPath = process.env.BLOG_DB_PATH || './data/blog.db';

let db: Database | null = null;

export function getDb(): Database {
	if (!db) {
		db = new Database(dbPath);
		initialize();
	}
	return db;
}

function initialize() {
	getDb().exec(`
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			slug TEXT UNIQUE NOT NULL,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			excerpt TEXT,
			published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
		CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at);
	`);
}

export function getAllPosts(): Post[] {
	return getDb().query('SELECT id, slug, title, excerpt, published_at FROM posts ORDER BY published_at DESC').all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
	return getDb().query('SELECT * FROM posts WHERE slug = ?').get(slug) as Post | undefined;
}

export function createPost(slug: string, title: string, content: string, excerpt = '') {
	return getDb().query('INSERT INTO posts (slug, title, content, excerpt) VALUES (?, ?, ?, ?)').run(slug, title, content, excerpt);
}

export function updatePost(id: number, title: string, content: string, excerpt = '') {
	return getDb().query('UPDATE posts SET title = ?, content = ?, excerpt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, content, excerpt, id);
}

export function deletePost(id: number) {
	return getDb().query('DELETE FROM posts WHERE id = ?').run(id);
}

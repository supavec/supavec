import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
};

function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "src/content");

  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title || "Untitled Post",
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || "",
        author: data.author,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="w-full mx-auto">
      <h1 className="text-4xl font-bold mb-2">Supavec Blog</h1>
      <p className="text-muted-foreground mb-8">
        Articles, tutorials, and updates from the Supavec team
      </p>

      <h2 className="text-3xl font-bold mb-8">Blog Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
          <p className="text-muted-foreground">
            Check back soon for new articles.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0"
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
                  {post.title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {post.author && ` • ${post.author}`}
                </div>
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4">
                  <span className="text-blue-500 font-medium group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

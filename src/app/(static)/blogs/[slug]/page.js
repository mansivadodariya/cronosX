import BlogDetailView from '@/rendering/blogDetail';
import { BLOG_POSTS } from '@/rendering/blogs/data';

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

    return {
        title: `${post.title} | ChronosX Insights`,
        description: post.excerpt,
    };
}

export default async function BlogDetailsPage({ params }) {
    const { slug } = await params;
    return <BlogDetailView slug={slug} />;
}

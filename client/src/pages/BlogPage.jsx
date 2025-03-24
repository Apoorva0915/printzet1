const blogPosts = [
    {
      title: "The Future of Printing: Trends to Watch in 2025",
      date: "March 24, 2025",
      excerpt: "Discover the latest advancements in printing technology and how they are shaping the future of the industry.",
    },
    {
      title: "How to Choose the Best Paper for Your Prints",
      date: "March 15, 2025",
      excerpt: "A guide to selecting the right paper quality for different types of prints, from documents to posters.",
    },
    {
      title: "Eco-Friendly Printing: How We Are Making a Difference",
      date: "March 10, 2025",
      excerpt: "Learn about our commitment to sustainable printing and eco-friendly materials.",
    },
  ];
  
  const Blog = () => {
    return (
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Latest Blog Articles</h2>
          <p className="text-gray-600 text-lg">Stay updated with our latest insights and tips on printing.</p>
        </div>
  
        <div className="max-w-4xl mx-auto mt-10 grid gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{post.date}</p>
              <p className="text-gray-700 mt-3">{post.excerpt}</p>
              <button className="mt-4 text-blue-600 hover:underline">Read More →</button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Blog;
  
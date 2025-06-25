import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./DashboardContent.css";
import { useLocation } from "react-router-dom";

const DashboardContent = () => {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeCategory, setActiveCategory] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const location = useLocation();

  // Reset filters when navigating back
  useEffect(() => {
    if (location?.state?.resetFilters) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSearchTerm("");
      window.history.replaceState({}, document.title);
    }
  }, [location?.state?.resetFilters]);

  // Fetch posts based on selected filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = "http://localhost:3000/fetch/";
        if (selectedCategory || selectedSubcategory) {
          const params = new URLSearchParams();
          if (selectedCategory) params.append("category", selectedCategory);
          if (selectedSubcategory) params.append("subcategory", selectedSubcategory);
          url = `http://localhost:3000/fetch/subcategory?${params.toString()}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [selectedCategory, selectedSubcategory]);

  // Filter and sort posts
  const filteredPosts = posts.filter((post) => {
    const searchString = searchTerm.toLowerCase();
    return Object.values(post).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchString);
      } else if (Array.isArray(value)) {
        return value.some(
          (item) =>
            typeof item === "string" && item.toLowerCase().includes(searchString)
        );
      }
      return false;
    });
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  const categories = [
    {
      name: "Club",
      subcategories: ["RMF", "Splash Out", "Rhythmic Thunders", "VPOD", "Sports"],
      image: "/images/clubs-image.jpg",
    },
    {
      name: "Academics",
      subcategories: ["First year", "Second year", "Third year", "Fourth year"],
      image: "/images/academic-excellence.jpg",
    },
    {
      name: "Notices",
      subcategories: [],
      image: "/images/notice.jpg",
    },
    {
      name: "Skillhub",
      subcategories: ["Hackathons", "Coding-Contests", "Training programmes"],
      image: "/images/skill-hub.jpg",
    },
    {
      name: "Events",
      subcategories: [],
      image: "/images/events-icon.jpg",
    },
    {
      name: "Placements",
      subcategories: [],
      image: "/images/placements.jpg",
    },
  ];

  const toggleExpandPost = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="outer-box">
      <div className="left-container">
        <div className="dashboard-section">
          <div className="dashboard-content">
            <div className="category-container">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="category-wrapper"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                  onClick={() => {
                    if (category.subcategories.length === 0) {
                      setSelectedCategory(category.name);
                      setSelectedSubcategory(null);
                    }
                  }}
                >
                  <div className="category-icon">
                    <img src={category.image} alt={`${category.name} Icon`} className="category-image" />
                  </div>
                  <div className="category-name">{category.name}</div>
                  {category.subcategories.length > 0 &&
                    activeCategory === category.name && (
                      <div className="sub-category-container">
                        <ul>
                          {category.subcategories.map((subcategory, subIndex) => (
                            <li
                              key={subIndex}
                              className="subcategory-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(category.name);
                                setSelectedSubcategory(subcategory);
                              }}
                            >
                              {subcategory}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="feed-section">
          <div className="feed-header">
            <input
              type="text"
              className="search-bar"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ×
              </button>
            )}
            <div className="filter-container">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter ⌵
              </button>
              {showFilterOptions && (
                <div className="filter-dropdown">
                  <button
                    onClick={() => {
                      setSortOrder("desc");
                      setShowFilterOptions(false);
                    }}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder("asc");
                      setShowFilterOptions(false);
                    }}
                  >
                    Oldest First
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="feed-grid">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post, index) => (
                <div className="feed-item" key={index}>
                  <div className="feed-image">
                    {post.media?.length > 0 && post.media[0]?.url && (
                      <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
                        {post.media.map((media, idx) => (
                          <div key={idx} className="carousel-item">
                            {media.type.startsWith("image/") ? (
                              <div
                                onClick={() => setFullscreenImage(media.url)}
                                style={{ cursor: "pointer" }}
                              >
                                <img src={media.url} alt={`${post.title} ${idx}`} style={{ objectFit: "cover", width: "100%" }} />
                              </div>
                            ) : media.type === "video/mp4" ? (
                              <video src={media.url} controls style={{ width: "100%", height: "auto" }} />
                            ) : media.type === "application/pdf" ? (
                              <div className="pdf-container">
                                <iframe
                                  src={`https://docs.google.com/gview?url=${media.url}&embedded=true`}
                                  title="PDF Viewer"
                                ></iframe>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </Carousel>
                    )}
                  </div>
                  <div className="feed-content">
                    <h3>{post.title}</h3>
                    <p
                      className={`post-description ${
                        expandedPosts[post.id] ? "expanded" : "collapsed"
                      }`}
                    >
                      {post.description}
                    </p>
                    <button onClick={() => toggleExpandPost(post.id)} className="read-more-button">
                      {expandedPosts[post.id] ? "Read Less" : "Read More"}
                    </button>
                    {post.link && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
                        {post.link}
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <span className="close-button" onClick={() => setFullscreenImage(null)}>
            ×
          </span>
          <img src={fullscreenImage} alt="Full-Screen Preview" className="fullscreen-image" />
        </div>
      )}
      <div className="analytics-container">
        <h2>Analytics</h2>
        <img src="/images/powerbi-report.jpg" alt="Power BI Analytics" className="analytics-image" />
      </div>
    </div>
  );
};

export default DashboardContent;






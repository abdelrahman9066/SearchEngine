import { useState, useRef } from 'react';
import SearchResults from './components/SearchResults';
import './App.css';

function App() {
  const [results, setResults] = useState<{
    firstWordInfos?: Array<{
      word: string;
      count: number;
      pageRank: number;
      url: string;
    }>;
    secondWordInfos?: Array<{
      word: string;
      count: number;
      pageRank: number;
      url: string;
    }>;
    message?: string;
  } | null>(null);
  const [orderBy, setOrderBy] = useState('count');
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false); // Initially collapsed
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    const words = query.trim().split(/\s+/); // Split input into words
    const specialCharRegex = /[^a-zA-Z0-9\s]/g; // Regex to check for special characters
    const numberRegex = /\d/; // Regex to check for numbers

    // Validation
    if (words.length > 2) {
      setErrorMessage('Please enter no more than two words.');
      return;
    }
    if (specialCharRegex.test(query)) {
      setErrorMessage('Special characters are not allowed.');
      return;
    }
    if (numberRegex.test(query)) {
      setErrorMessage('Numbers are not allowed.');
      return;
    }

    setErrorMessage('');

    const [query1, query2] = words;
    if (!query1) return;

    try {
      let url = `https://searchengine.runasp.net/api/SearchEngine?word=${query1}`;
      if (query2) {
        url += `%20${query2}`;
      }
      url += `&orderBy=${orderBy}`;
      const response = await fetch(url);
      const data = await response.json();

      if (
        !data &&
        (!data.firstWordInfos?.length && (!query2 || !data.secondWordInfos?.length))
      ) {
        setErrorMessage('No results found.');
        setResults(null);
        setSearched(true);
        return;
      }

      setResults(data);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setErrorMessage('An error occurred. Please try again.');
      setResults(null);
      setSearched(true);
    }
  };

  const handleOrderByChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy);
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  const toggleSearchBar = () => {
    setExpanded(!expanded);
  };

  let searchResultsProps;
  if (Array.isArray(results)) {
    searchResultsProps = {
      firstWordInfos: results,
      secondWordInfos: [],
      message: '',
    };
  } else if (results) {
    searchResultsProps = {
      firstWordInfos: results.firstWordInfos || [],
      secondWordInfos: results.secondWordInfos || [],
      message: results.message || '',
    };
  } else {
    searchResultsProps = null;
  }

  return (
    <div className="container">
      <div className={`app-root${searched ? ' searched' : ''}`}>
        <header className="site-header">
          <div className="logo-circle">
            <span className="logo-text">SE</span>
          </div>
          <span className="site-title">Search Engine</span>
        </header>
        <main className="main-content">
          {!searched && (
            <h1 className="main-title">Find Anything Instantly</h1>
          )}
          <div className={`search-bar-outer${searched ? ' to-top' : ''}`}>
            <div className={`search-bar-inner ${expanded ? 'expanded' : 'collapsed'}`}>
              {expanded && (
                <>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Type your search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                  <div className="order-buttons">
                    <button
                      className={`order-btn${orderBy === 'pagerank' ? ' active' : ''}`}
                      onClick={() => handleOrderByChange('pagerank')}
                      type="button"
                    >
                      Page Rank
                    </button>
                    <button
                      className={`order-btn${orderBy === 'count' ? ' active' : ''}`}
                      onClick={() => handleOrderByChange('count')}
                      type="button"
                    >
                      Inverted Index
                    </button>
                  </div>
                </>
              )}
              <button
                className="search-toggle-btn"
                onClick={toggleSearchBar}
                title={expanded ? "Collapse Search" : "Expand Search"}
                aria-label={expanded ? "Collapse Search" : "Expand Search"}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {expanded ? (
                    <line x1="5" y1="5" x2="19" y2="19" />
                  ) : (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          {errorMessage && (
            <div className="error-box">
              <p>{errorMessage}</p>
            </div>
          )}
          <div className={`results-box${searched && results ? ' expanded' : ''}`}>
            {results && <SearchResults results={searchResultsProps} orderBy={orderBy} />}
          </div>
        </main>
        <div
          className="scroll-indicator"
          onClick={() => {
            if (aboutRef.current) {
              aboutRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="arrow-down">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
        <div ref={aboutRef} className="about-section">
          <h2>Project Review</h2>
          <p>
            Our search engine is designed to provide fast and accurate results using advanced algorithms
            including PageRank and Inverted Index. We focus on delivering relevant content while
            maintaining a clean and user-friendly interface.
          </p>
        </div>
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-member">
            <h3>Abdelrahman Ehab</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <h3>Amr Muhammed</h3>
              <p>Backend Developer</p>
            </div>
            <div className="team-member">
              <h3>Shehab Muhammed</h3>
              <p>Backend Developer</p>
            </div>
            <div className="team-member">
              <h3>Assem Amr</h3>
              <p>Backend Developer</p>
            </div>
          </div>
        </div>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Search Engine. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
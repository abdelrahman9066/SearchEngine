import React, { useState } from 'react';

interface ResultInfo {
  word: string;
  count: number;
  pageRank: number;
  url: string;
}

interface SearchResultsProps {
  results: {
    firstWordInfos?: ResultInfo[];
    secondWordInfos?: ResultInfo[];
    message?: string;
  } | null;
  orderBy: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, orderBy }) => {
// Pagination state
const [firstPage, setFirstPage] = useState<number>(1);
const [secondPage, setSecondPage] = useState<number>(1);

if (!results || (!results.firstWordInfos && !results.secondWordInfos)) {
  return null;
}

const { firstWordInfos = [], secondWordInfos = [], message = '' } = results;
  const pageSize = 10;

  // Pagination logic
  const firstTotalPages = Math.ceil(firstWordInfos.length / pageSize);
  const secondTotalPages = Math.ceil(secondWordInfos.length / pageSize);

  const paginatedFirst = firstWordInfos.slice((firstPage - 1) * pageSize, firstPage * pageSize);
  const paginatedSecond = secondWordInfos.slice((secondPage - 1) * pageSize, secondPage * pageSize);

  const showFirst = firstWordInfos.length > 0;
  const showSecond = secondWordInfos.length > 0;

  if (!showFirst && !showSecond) {
    return null;
  }

  return (
    <div className="results-box expanded">
      {message && <div className="results-message">{message}</div>}
      <div className="results-columns">
        {firstWordInfos.length > 0 && (
          <div className="results-column">
            <h3>Results for "{firstWordInfos[0]?.word}"</h3>
            {paginatedFirst.map((result, idx) => (
              <div key={idx}>
                <a
                  className="result-link"
                  href={`http://${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.url}
                </a>
                {orderBy === 'count' && (
                  <div className="result-count">Count: {result.count}</div>
                )}
              </div>
            ))}
            {firstTotalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={firstPage === 1}
                  onClick={() => setFirstPage(firstPage - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {firstPage} of {firstTotalPages}
                </span>
                <button
                  disabled={firstPage === firstTotalPages}
                  onClick={() => setFirstPage(firstPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {secondWordInfos.length > 0 && (
          <div className="results-column">
            <h3>Results for "{secondWordInfos[0]?.word}"</h3>
            {paginatedSecond.map((result, idx) => (
              <div key={idx}>
                <a
                  className="result-link"
                  href={`http://${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.url}
                </a>
                {orderBy === 'count' && (
                  <div className="result-count">Count: {result.count}</div>
                )}
              </div>
            ))}
            {secondTotalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={secondPage === 1}
                  onClick={() => setSecondPage(secondPage - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {secondPage} of {secondTotalPages}
                </span>
                <button
                  disabled={secondPage === secondTotalPages}
                  onClick={() => setSecondPage(secondPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
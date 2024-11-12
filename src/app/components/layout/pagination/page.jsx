import React from 'react';
import './pagination.css';

const Pagination = ({
    currentPage,
    totalEntries,
    entriesPerPage,
    hasNextPage,
    hasPrevPage,
    handlePageChange,
}) => {
    const totalEntriesValid =
        Number.isFinite(totalEntries) && totalEntries >= 0 ? totalEntries : 0;
    const totalPages =
        totalEntriesValid > 0
            ? Math.ceil(totalEntriesValid / entriesPerPage)
            : 1;

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxDisplayedPages = 3;
        let startPage = Math.max(1, currentPage - maxDisplayedPages);
        let endPage = Math.min(totalPages, currentPage + maxDisplayedPages);

        if (currentPage <= maxDisplayedPages) {
            endPage = Math.min(totalPages, maxDisplayedPages * 2);
        }
        if (currentPage + maxDisplayedPages >= totalPages) {
            startPage = Math.max(1, totalPages - maxDisplayedPages * 2 + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li
                    key={i}
                    className={`page-item ${currentPage === i ? 'active' : ''}`}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>,
            );
        }
        return pageNumbers;
    };

    return (
        <div className="clearfix mb-4">
            <div className="hint-text">
                Showing{' '}
                <b>
                    {totalEntries > 0
                        ? (currentPage - 1) * entriesPerPage + 1
                        : 0}
                </b>{' '}
                to{' '}
                <b>
                    {totalEntries > 0
                        ? Math.min(currentPage * entriesPerPage, totalEntries)
                        : 0}
                </b>{' '}
                out of <b>{totalEntries}</b> entries
            </div>

            <ul className="pagination">
                <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                    >
                        Previous
                    </button>
                </li>

                {renderPageNumbers()}
                <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;

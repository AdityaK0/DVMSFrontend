import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // hide if only one page

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous */}
      <button
        className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
            num === currentPage
              ? "bg-primary-600 text-black shadow-md"
              : "bg-primary-50 text-primary-600 hover:bg-primary-100"
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;


// import React from "react";

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   if (totalPages <= 1) return null; // hide if only one page

//   const pageNumbers = [];

//   // Generate page numbers (you can improve with ellipsis if too many pages)
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className="flex items-center justify-center space-x-2 mt-6">
//       {/* Previous */}
//       <button
//         className={`px-3 py-1 rounded border ${
//           currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
//         }`}
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//       >
//         Prev
//       </button>

//       {/* Page Numbers */}
//       {pageNumbers.map((num) => (
//         <button
//           key={num}
//           className={`px-3 py-1 rounded border ${
//             num === currentPage
//               ? "bg-primary-600 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//           onClick={() => onPageChange(num)}
//         >
//           {num}
//         </button>
//       ))}

//       {/* Next */}
//       <button
//         className={`px-3 py-1 rounded border ${
//           currentPage === totalPages
//             ? "bg-gray-200 cursor-not-allowed"
//             : "bg-white hover:bg-gray-100"
//         }`}
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;

import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <style jsx="true">{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(0, 123, 255, 0.3);
          border-radius: 50%;
          border-top-color: #007bff;
          animation: spin 1s linear infinite;
        }
        
        .loading-text {
          margin-top: 20px;
          font-size: 18px;
          color: #007bff;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="spinner"></div>
      <div className="loading-text">Loading Blog Posts...</div>
    </div>
  );
};

export default Loader;
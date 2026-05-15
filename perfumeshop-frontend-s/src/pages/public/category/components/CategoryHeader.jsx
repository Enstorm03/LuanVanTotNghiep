import React from 'react';

const CategoryHeader = ({ title }) => (
  <div className="flex flex-wrap justify-between items-center gap-3">
    <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
      {title}
    </p>
  </div>
);

export default CategoryHeader;

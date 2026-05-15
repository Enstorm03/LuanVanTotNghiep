import { useState, useEffect } from 'react';
import api from '../services/api';

const useCategoryMetadata = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          api.getCategories(),
          api.getBrands()
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return {
    categories,
    brands,
    loading
  };
};

export default useCategoryMetadata;

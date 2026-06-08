// Category helpers for category page

export const getCategoryName = (id, categories) => {
  const category = categories.find(cat => cat.idDanhMuc === parseInt(id));
  return category ? category.tenDanhMuc : "Tất cả sản phẩm";
};

export const getBrandName = (id, brands) => {
  const brand = brands.find(b => b.idThuongHieu === parseInt(id));
  return brand ? brand.tenThuongHieu : "Tất cả thương hiệu";
};

export const getCategoryTitle = (categoryId, brandId, searchQuery, categories, brands) => {
  if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`;
  if (brandId) return getBrandName(brandId, brands);
  if (categoryId) return getCategoryName(categoryId, categories);
  return "Tất cả sản phẩm";
};

export const getConcentrationTypes = () => [
  { label: 'Parfum / Extrait (>= 20%)',     value: 20 },
  { label: 'Eau de Parfum – EDP (15–20%)',  value: 15 },
  { label: 'Eau de Toilette – EDT (5–15%)', value: 5  },
  { label: 'Eau de Cologne – EDC (2–4%)',   value: 2  },
];

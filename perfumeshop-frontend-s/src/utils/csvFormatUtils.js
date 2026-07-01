/**
 * Standardized CSV format utility for product import
 * Used by both Supplier Portal and Admin Import Kho pages
 */

/**
 * Calculate months remaining until expiry date
 * Returns number of months or null if invalid date
 */
export const calculateMonthsToExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return null;
  const months = (expiry.getFullYear() - today.getFullYear()) * 12 + (expiry.getMonth() - today.getMonth());
  return Math.max(0, months);
};

/**
 * Standard CSV column headers — snake_case khớp với backend parser
 */
export const CSV_HEADERS = [
  'ten_san_pham',
  'mo_ta',
  'gia_de_xuat',
  'so_luong',
  'dung_tich_ml',
  'nong_do',
  'url_hinh_anh',
  'ghi_chu',
  'hanSuDung',
  'soLo',
];

/**
 * Display headers for users (Vietnamese labels)
 */
export const CSV_DISPLAY_HEADERS = {
  ten_san_pham: 'Tên sản phẩm *',
  mo_ta: 'Mô tả',
  gia_de_xuat: 'Giá đề xuất (₫) *',
  so_luong: 'Số lượng *',
  dung_tich_ml: 'Dung tích (ml)',
  nong_do: 'Nồng độ (%)',
  url_hinh_anh: 'URL hình ảnh',
  ghi_chu: 'Ghi chú',
  hanSuDung: 'Hạn sử dụng (YYYY-MM-DD)',
  soLo: 'Số lô',
};

/**
 * Required fields for valid product import
 */
export const REQUIRED_FIELDS = [
  'ten_san_pham',
  'gia_de_xuat',
  'so_luong',
];

/**
 * Numeric fields that should be converted to numbers
 */
export const NUMERIC_FIELDS = [
  'gia_de_xuat',
  'so_luong',
  'dung_tich_ml',
  'nong_do',
];

/**
 * Convert form data to CSV row
 * Input: object with field values
 * Output: CSV-formatted string
 */
export const formDataToCSVRow = (formData) => {
  return CSV_HEADERS.map(header => {
    const value = formData[header];
    
    // Handle null/undefined
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Escape quotes and wrap in quotes if contains comma
    let stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      stringValue = `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }).join(',');
};

/**
 * Convert multiple form data objects to CSV string
 * Input: array of form objects
 * Output: complete CSV string with headers
 */
export const formDataToCSV = (formDataArray) => {
  if (!Array.isArray(formDataArray) || formDataArray.length === 0) {
    return '';
  }

  // Header row
  const headerRow = CSV_HEADERS.join(',');
  
  // Data rows
  const dataRows = formDataArray.map(formData => formDataToCSVRow(formData)).join('\n');

  return `${headerRow}\n${dataRows}`;
};

/**
 * Parse CSV string to array of objects
 * Input: CSV string with headers
 * Output: array of objects with standardized fields
 */
export const parseCSVToArray = (csvString) => {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]);
  
  // Validate headers contain required fields
  const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    console.warn('CSV missing standard headers:', missingHeaders);
  }

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    const obj = {};

    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Convert numeric fields
      if (NUMERIC_FIELDS.includes(header) && value !== '') {
        value = Number(value);
        if (isNaN(value)) {
          value = '';
        }
      }

      obj[header] = value;
    });

    result.push(obj);
  }

  return result;
};

/**
 * Parse a single CSV line, handling quoted values
 * Handles CSV escaping: "value with, comma" and "quote""d"
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: ""
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
};

/**
 * Generate downloadable CSV file
 * Input: array of form objects, filename
 */
export const downloadCSV = (formDataArray, filename = 'san_pham_import.csv') => {
  const csv = formDataToCSV(formDataArray);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Validate CSV row data
 * Returns array of validation errors, empty if valid
 */
export const validateCSVRow = (rowData, rowIndex) => {
  const errors = [];

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    const value = rowData[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push(`Hàng ${rowIndex}: ${CSV_DISPLAY_HEADERS[field]} là bắt buộc`);
    }
  });

  // Validate numeric fields
  NUMERIC_FIELDS.forEach(field => {
    const value = rowData[field];
    if (value !== null && value !== undefined && value !== '') {
      if (isNaN(Number(value))) {
        errors.push(`Hàng ${rowIndex}: ${CSV_DISPLAY_HEADERS[field]} phải là số`);
      } else if (Number(value) < 0) {
        errors.push(`Hàng ${rowIndex}: ${CSV_DISPLAY_HEADERS[field]} phải lớn hơn 0`);
      }
    }
  });

  // Validate date format
  if (rowData.hanSuDung) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(rowData.hanSuDung)) {
      errors.push(`Hàng ${rowIndex}: Hạn sử dụng phải có định dạng YYYY-MM-DD`);
    } else {
      const date = new Date(rowData.hanSuDung);
      if (isNaN(date.getTime())) {
        errors.push(`Hàng ${rowIndex}: Hạn sử dụng không hợp lệ`);
      } else if (date < new Date()) {
        errors.push(`Hàng ${rowIndex}: Hạn sử dụng không được trong quá khứ`);
      }
    }
  }

  // Validate URL format
  if (rowData.urlHinhAnh) {
    try {
      new URL(rowData.urlHinhAnh);
    } catch {
      errors.push(`Hàng ${rowIndex}: URL hình ảnh không hợp lệ`);
    }
  }

  return errors;
};

/**
 * Generate sample CSV template for users to download
 */
export const generateCSVTemplate = () => {
  const sampleData = [
    {
      tenSanPham: 'Bleu de Chanel',
      moTa: 'Mùi hương nam',
      giaDeXuat: 350000,
      soLuongCoTheCungCap: 50,
      dungTichMl: 100,
      nongDo: 20,
      urlHinhAnh: '',
      ghiChu: 'Hàng chính hãng',
      hanSuDung: '2027-12-31',
      soLo: 'LOT001',
    },
  ];

  return formDataToCSV(sampleData);
};

/**
 * Export all utilities as object
 */
export const csvUtils = {
  CSV_HEADERS,
  CSV_DISPLAY_HEADERS,
  REQUIRED_FIELDS,
  NUMERIC_FIELDS,
  formDataToCSVRow,
  formDataToCSV,
  parseCSVToArray,
  downloadCSV,
  validateCSVRow,
  generateCSVTemplate,
  parseCSVLine,
};

export default csvUtils;
import api from './config.jsx';

export const productsAPI = {
  // Public endpoints
  getAll: async (params = {}) => {
    const response = await api.get('products/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`products/vendor/products/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('categories/');
    return response.data;
  },

  getVendorCatalog: async (vendorId, params = {}) => {
    const response = await api.get(`vendor/${vendorId}/my-products/`, { params });
    return response.data;
  },

  // Vendor endpoints (authenticated)
  getVendorProducts: async (params = {}) => {
    const response = await api.get('products/vendor/my-products/', { params });
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('products/vendor/my-products/create/', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.patch(`products/vendor/my-products/${id}/update/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  activate_product:async (id, productData) => {
    const response = await api.patch(`products/vendor/my-products/${id}/activate/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response
  },

  delete: async (id) => {
    const response = await api.delete(`products/vendor/my-products/${id}/delete/`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('products/vendor/search/', {
      params: { q: query },
    });
    return response.data;
  },

  // filter: async (category) => {
  //   const response = await api.get('products/vendor/filter/', {
  //     params: { category },
  //   });
  //   return response.data;
  // },

    filter: async (filters) => {
    console.log("Sending filters to API:", filters);
    const response = await api.get("products/vendor/filter/", { params: filters });
    return response.data;
  }

};



// import api from './config.jsx';

// export const productsAPI = {
//   getAll: async () => {
//     const response = await api.get('vendor/products/');
//     return response.data;
//   },

//   getById: async (id) => {
//     const response = await api.get(`/products/${id}/`);
//     return response.data;
//   },

//   create: async (productData) => {
//     const response = await api.post('vendor/products/', productData);
//     return response.data;
//   },

//   update: async (id, productData) => {
//     const response = await api.put(`/products/${id}/`, productData);
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/products/${id}/`);
//     return response.data;
//   },
// };

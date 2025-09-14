import api from './config.jsx';

export const vendorAPI = {
  create: async (vendorData) => {
    const formData = new FormData()

    Object.keys(vendorData).forEach((key) => {
      if (vendorData[key] !== null && vendorData[key] !== undefined) {
        formData.append(key, vendorData[key]);
      }
    });



    const response = await api.post('/vendors/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

// create: async (vendorData) => {
//   const formData = new FormData();

//   // Separate address fields
//   const addressFields = ["street", "city", "state", "zip_code", "country", "latitude", "longitude"];
//   const addressPayload = {};

//   Object.keys(vendorData).forEach((key) => {
//     if (vendorData[key] !== null && vendorData[key] !== undefined) {
//       if (addressFields.includes(key)) {
//         addressPayload[key] = vendorData[key]; // collect address fields
//       } else {
//         formData.append(key, vendorData[key]); // append other fields normally
//       }
//     }
//   });

//   // Append the full address object as a JSON string
//   formData.append("address", JSON.stringify(addressPayload));

//   // Append logo if exists
//   if (vendorData.logo) {
//     formData.append("logo", vendorData.logo);
//   }

//   const response = await api.post("/vendors/create/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return response.data;
// },

  getById: async (id) => {
    const response = await api.get(`/vendors/${id}/`);
    return response.data;
  },

  update: async (id, vendorData) => {
    const response = await api.put(`/vendors/profile/${id}/`, vendorData);
    return response.data;
  },


  getAnalytics: async (id) => {
    const response = await api.get(`/vendors/${id}/analytics/`);
    return response.data;
  },
};

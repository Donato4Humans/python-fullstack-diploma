
export const transformListResponse = (response: any) => {
  // 1. If the response is already an array, return it
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  if (response && Array.isArray(response.results)) {
    return response.results;
  }

  // 4. Fallback: Return empty array to prevent .map() crashes
  return [];
};
/**
 * Example Usage:
 * ```
 * import api from "../utils/api";
 *
 * // GET request
 * async function fetchData() {
 *   try {
 *     const data = await api("/api/data");
 *     console.log(data);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * }
 *
 * // POST request with JSON body
 * async function createItem(itemData: any) {
 *   try {
 *     const data = await api("/api/items", {
 *       method: "POST",
 *       body: JSON.stringify(itemData),
 *     });
 *     console.log("Item created:", data);
 *   } catch (error) {
 *     console.error("Error creating item:", error);
 *   }
 * }
 *
 * // PUT request with JSON body
 * async function updateItem(itemId: string, itemData: any) {
 *   try {
 *     const data = await api(`/api/items/${itemId}`, {
 *       method: "PUT",
 *       body: JSON.stringify(itemData),
 *     });
 *     console.log("Item updated:", data);
 *   } catch (error) {
 *     console.error("Error updating item:", error);
 *   }
 * }
 *
 * // DELETE request
 * async function deleteItem(itemId: string) {
 *   try {
 *     await api(`/api/items/${itemId}`, {
 *       method: "DELETE",
 *     });
 *     console.log("Item deleted");
 *   } catch (error) {
 *     console.error("Error deleting item:", error);
 *   }
 * }
 *
 * // POST request with custom headers
 * async function uploadFile(file: File) {
 *   try {
 *     const formData = new FormData();
 *     formData.append("file", file);
 *
 *     const data = await api("/api/upload", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "multipart/form-data", // Important: Remove default JSON header
 *       },
 *       body: formData as any, // FormData is not directly assignable to RequestInit's body
 *     });
 *     console.log("File uploaded:", data);
 *   } catch (error) {
 *     console.error("Error uploading file:", error);
 *   }
 * }
 *
 * // GET request with query parameters
 * async function searchItems(query: string) {
 *   try {
 *     const data = await api(`/api/search?q=${query}`);
 *     console.log("Search results:", data);
 *   } catch (error) {
 *     console.error("Error searching items:", error);
 *   }
 * }
 *
 * // Handling non-JSON responses (e.g., text)
 * async function getTextData() {
 *   try {
 *     const response = await api("/api/text", {
 *       headers: {
 *         "Content-Type": "text/plain", // Or whatever the content type is
 *       },
 *     });
 *     const textData = await response.text(); // Use response.text() instead of response.json()
 *     console.log("Text data:", textData);
 *   } catch (error) {
 *     console.error("Error fetching text data:", error);
 *   }
 * }
 * ```
 */
const BASE_URL = "http://localhost:8000";

const api = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${BASE_URL}${url}`, mergedOptions);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        // Check if the response is JSON or text
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
};

export default api;

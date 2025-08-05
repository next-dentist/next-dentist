// Base API functions for fetching data

/**
 * Generic function to fetch data from API
 */
export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  return response.json();
}

/**
 * Generic function to post data to API
 */
export async function postData<T, R>(
  url: string,
  data: T,
  options?: RequestInit
): Promise<R> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error posting data: ${response.status}`);
  }

  return response.json();
}

/**
 * Generic function to update data via API
 */
export async function updateData<T, R>(
  url: string,
  data: T,
  options?: RequestInit
): Promise<R> {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error updating data: ${response.status}`);
  }

  return response.json();
}

/**
 * Generic function to delete data via API
 */
export async function deleteData(
  url: string,
  options?: RequestInit
): Promise<void> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error deleting data: ${response.status}`);
  }
}

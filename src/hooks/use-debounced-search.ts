import { useState, useEffect } from "react";

export function useDebouncedSearch<T>(
  items: T[],
  searchKey: keyof T,
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  // Update debounced value after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  // Update filtered items when items or debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) => {
      const value = String(item[searchKey]).toLowerCase();
      return value.includes(debouncedSearchTerm.toLowerCase());
    });

    setFilteredItems(filtered);
  }, [items, debouncedSearchTerm, searchKey]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}

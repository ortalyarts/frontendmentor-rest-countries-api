'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ListCountries from '@/components/listCountries';

import { useCountriesStore } from '@/lib/storeCountries.js'; // zustand store for mobile navigation

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observerRef = useRef();

  const searchQuery = searchParams.get('q') || '';
  const region = searchParams.get('region') || '';
  const take = 20;

  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [triggerFetch, setTriggerFetch] = useState(false); // to control fetch explicitly

  // Zustand store for fetched countries
  const fetchedCountries = useCountriesStore(state => state.fetchedCountries);
  const setFetchedCountries = useCountriesStore(state => state.setFetchedCountries);

  const fetchCountries = useCallback(async (currentPage = 0, replace = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      q: searchQuery,
      region,
      skip: (currentPage * take).toString(),
      take: take.toString(),
    });

    const res = await fetch(`/api?${params}`);
    const data = await res.json();

    if (replace) {
      setCountries(data.countries);
    } else {
      setCountries(prev => [...prev, ...data.countries]);
    }

    setHasMore(data.countries.length === take);
    setLoading(false);

    // Update Zustand store with fetched countries
    setFetchedCountries(data.countries);

  }, [searchQuery, region]);

  // Fetch when page changes (but not on first render after reset)
  useEffect(() => {
    if (page === 0) return;
    fetchCountries(page);
  }, [page, fetchCountries]);

  // Reset when filters change
  useEffect(() => {
    setCountries([]);
    setPage(0);
    setHasMore(true);
    fetchCountries(0, true); // replace data
  }, [searchQuery, region, fetchCountries]);

  // Set up IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loading]);


  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    searchQuery ? params.set('q', searchQuery) : params.delete('q');
    region ? params.set('region', region) : params.delete('region');
    router.push(`?${params.toString()}`);
  }

  function handleRegionChange(e) {
    const newRegion = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    searchQuery ? params.set('q', searchQuery) : params.delete('q');
    newRegion ? params.set('region', newRegion) : params.delete('region');
    router.push(`?${params.toString()}`);
  }

  return (
    <>
      <div className="search-filter-holder">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a country..."
            defaultValue={searchQuery}
            onChange={e => router.push(`?q=${e.target.value}&region=${region}`)}
          />
        </form>

        <div className="select-wrapper">
          <label htmlFor="region-select" className="sr-only">Filter by origin</label>
          <select id="region-select" value={region} onChange={handleRegionChange} className="select-styled">
            <option value="">Filter by origin</option>
            <option value="Africa">Africa</option>
            <option value="Americas">America</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
      </div>

      {!loading && countries.length === 0 && (
        <p className="text-center text-gray-500">No countries found. Try another search term.</p>
      )}
      {loading && countries.length === 0 && (
        <ul className="list-countries placeholder">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="country-list-item" />
          ))}
        </ul>
      )}
      {countries.length > 0 && (
        <ListCountries listCountries={countries} router={router}/>
      )}
      {hasMore && <div ref={observerRef} style={{ height: 1 }} />}
    </>
  );
}

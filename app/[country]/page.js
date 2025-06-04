'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useCountriesStore } from '@/lib/storeCountries.js'; // zustand store for mobile navigation
import IconArrowLeft from '@/components/UI/iconArrowLeft';
import Spinner from '@/components/UI/spinner';

export default function Page() {
    const { country } = useParams();
    const fetchedCountries = useCountriesStore(state => state.fetchedCountries);
    const selectedFromStore = fetchedCountries.find(c => c.alpha3Code === country);

    const [selectedCountry, setSelectedCountry] = useState(selectedFromStore || null);
    const [loading, setLoading] = useState(!selectedFromStore);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedFromStore) {
        setLoading(true);
        fetch(`/api/${country}`)
            .then(res => {
            if (!res.ok) throw new Error('Country not found');
            return res.json();
            })
            .then(data => setSelectedCountry(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
        }
    }, [country, selectedFromStore]);

    if (loading) return <div className='error-page'><Spinner /></div>;
    if (error) return <div className='error-page'>
        <Link href="/" className="btn-main"><IconArrowLeft />
            <span className="text-3">Back</span>
        </Link>
        <p>Error: {error}</p></div>;
    if (!selectedCountry) return 
        <div className='error-page'>
        <Link href="/" className="btn-main"><IconArrowLeft />
            <span className="text-3">Back</span>
        </Link><p>Country not found</p>
        </div>;

// console.log("code: ", country);
// console.log("contry: ", selectedCountry);
// console.log("fetchedCountries: ", fetchedCountries);


    return (
    <div className='contry-page'>
        <div className="back-button-holder">
            <Link href="/" className="btn-main">
                <IconArrowLeft />
                <span className="text-3">Back</span>
            </Link>
        </div>
        <div className="country-details">
            <div className="flag-holder">
                <Image src={selectedCountry.flagSvg} alt={`Flag of ${selectedCountry.name}`} width={560} height={401} />
            </div>
            <div>
                <h2 className="text-0">{selectedCountry.name}</h2>
                <div className="details-holder">
                    <div>                        
                        <p className="text-4"><span className="text-4-b">Native Name:</span> {selectedCountry.nativeName}</p>
                        <p className="text-4"><span className="text-4-b">Population: </span> 
                            {selectedCountry.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <p className="text-4"><span className="text-4-b">Region:</span> {selectedCountry.region}</p>
                        <p className="text-4"><span className="text-4-b">Sub Region:</span> {selectedCountry.subregion}</p>
                        <p className="text-4"><span className="text-4-b">Capital:</span> {selectedCountry.capital}</p>
                    </div>
                    <div>
                        <p className="text-4"><span className="text-4-b">Top Level Domain:</span> {selectedCountry.topLevelDomain}</p>
                        <p className="text-4"><span className="text-4-b">Currencies: </span> {selectedCountry.currencies}</p>
                        <p className="text-4"><span className="text-4-b">Languages:</span> {selectedCountry.languages.join(', ')}</p>
                    </div>
                </div>
                <div className='border-countries-holder'>
                    <p className="text-4-b">Border Countries:</p>
                    <ul className="border-countries">
                        {selectedCountry.borders && selectedCountry.borders.length > 0 ? (
                            selectedCountry.borders.map(border => {
                                const borderCountry = fetchedCountries.find(c => c.alpha3Code === border);
                                return (
                                    <li key={border} className="border-country">
                                        <Link href={`/${border}`} className="border-country-link">
                                            {borderCountry ? borderCountry.name : border}
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="no-borders">No Border Countries</li>
                        )}
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
    )
}

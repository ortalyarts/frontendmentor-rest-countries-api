import Image from "next/image";
import Link from "next/link";

export default function ListCountries({listCountries, router}){

    return(
    <ul className="list-countries">
        {listCountries.map((country, index) => (
            <li key={country.alpha3Code} className="country-list-item">
                <div
                    role="link"
                    tabIndex={0}
                    className="country-card"
                    onClick={() => router.push(`/${country.alpha3Code}`)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') router.push(`/${country.alpha3Code}`);
                    }}
                >
                    <div className="flag-holder">
                        <Image src={country.flagSvg} alt={`Flag of ${country.name}`} width={264} height={160}
                        priority={index < 4}  />  {/* Apply priority only to first 2 images */}
                    </div>
                    <div className="info-holder">
                        {/* <Link href={`/${country.alpha3Code}`} className="country-link"> */}
                        <Link href={`/${country.alpha3Code}`} className="sr-only"><h2 className="text-2">{country.name}</h2></Link>
                        <h2 className="text-2">{country.name}</h2>
                        <p className="text-4"><span className="text-4-b">Population: </span> 
                            {country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        <p className="text-4"><span className="text-4-b">Region:</span> {country.region}</p>
                        <p className="text-4"><span className="text-4-b">Capital:</span> {country.capital}</p>
                        
                    </div>
                </div>
            </li>
        ))}
    </ul>
    )
}
import HomePage from "@/components/homePage.jsx";
import Spinner from "@/components/UI/spinner";
import { Suspense } from "react";

export default async function Home() {

  // const countries = await getCountries();
  // console.log(countries);
  return (
    <>
    <Suspense fallback={<Spinner />} >
      <HomePage />
    </Suspense>
    </>
  );
}

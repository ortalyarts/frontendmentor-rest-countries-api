import "./globals.css";
import Header from "@/components/header.jsx";

export const metadata = {
  title: "Rest Countries API",
  description: "Explore countries around the world with region filtering, search, and detailed border info. A Frontend Mentor API challenge solution.",
  author: "OrtalyARTS",

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          <div className="main-holder">
          {children}
          </div>
        </main>
      </body>
    </html>
  );
}

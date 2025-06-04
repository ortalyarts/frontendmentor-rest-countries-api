import ColorThemeToggle from "@/components/UI/colorThemeToggle.jsx";

export default function Header(){
    return(
        <header className="header-holder">
            <div className="main-holder">
                <div className="header-items">
                    <h1 className="text-1">Where in the world?</h1>
                    <div className="dark-mode">
                       
                        <ColorThemeToggle />
                    </div>
                </div>
                
            </div>
        </header>
    )
}
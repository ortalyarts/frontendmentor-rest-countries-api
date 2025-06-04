'use client'

import { useTheme } from "@/hooks/useTheme";
import IconSun from "@/components/UI/iconSun";
import IconMoon from "@/components/UI/iconMoon";

export default function ColorThemeToggle() {
    const { theme, setTheme } = useTheme();


    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return(
        <button type="button" className="btn color-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <><IconSun/> <span>Light mode</span></>
            :
            <><IconMoon/> <span>Dark mode</span></>
            }
            {/* <span >{theme === "dark" ? "Light" : "Dark"} Mode</span> */}
        </button>
    )
}
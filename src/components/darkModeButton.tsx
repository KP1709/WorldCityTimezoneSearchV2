import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Moon, Sun } from 'lucide-react';

type DarkModeToggleProps = {
    setMapDarkMode: (val: boolean) => void;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ setMapDarkMode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // TODO - use system preference as default theme
            // setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
            setIsDarkMode(savedTheme === 'light');
        }
        return () => localStorage.removeItem('theme');
    }, []);

    const toggleDarkMode = (): void => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        setMapDarkMode(newMode);

        document.documentElement.classList.toggle('dark', newMode);

        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={toggleDarkMode}>
                    {isDarkMode ? <Sun /> : <Moon />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Toggle mode</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DarkModeToggle;
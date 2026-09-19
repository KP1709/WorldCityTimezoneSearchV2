import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const FlyToLocationButton = ({ handleEaseTo }: { handleEaseTo: () => void; }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button onClick={handleEaseTo}><MapPinned /></Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>Focus on location</p>
        </TooltipContent>
    </Tooltip>
);

export default FlyToLocationButton;
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LiveIndicator = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="absolute top-3 right-3 flex cursor-help items-center gap-2" aria-label="Live time updates">
                    <span className="flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent>Time updates live</TooltipContent>
        </Tooltip>
    );
};

export default LiveIndicator;
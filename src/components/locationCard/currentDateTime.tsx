import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface TimeDateProps {
    timezone: string;
    time: boolean;
}

const TimeDate: React.FC<TimeDateProps> = ({ timezone, time = true }) => {
    const [calculatedTimezone, setCalculatedTimezone] = useState<string | undefined>(undefined);
    const [timeDate, setTimeDate] = useState<DateTime>(DateTime.now());

    useEffect(() => {
        (() => timezone ? setCalculatedTimezone(timezone) : setCalculatedTimezone(undefined))();
    }, [timezone]);

    useEffect(() => {
        if (!calculatedTimezone) return;

        const updateTimeDate = () => setTimeDate(DateTime.now().setZone(calculatedTimezone));
        updateTimeDate();
        const interval = setInterval(updateTimeDate, 1000);

        return () => clearInterval(interval);
    }, [calculatedTimezone]);

    if (time) {
        return <>{calculatedTimezone ? timeDate.toFormat('HH:mm') : 'Loading...'}</>;
    }

    return <>{calculatedTimezone ? timeDate.toFormat('DDD') : 'Loading...'}</>;

};

export default TimeDate;
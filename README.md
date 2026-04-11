# World City Timezone Search V2
[![Netlify Status](https://api.netlify.com/api/v1/badges/4f47638c-fd95-4996-8720-f372af650bd6/deploy-status)](https://app.netlify.com/projects/kareenapatel-worldcitytimezonesearch2/deploys)

## ⌨️ Tech stack
React / Typescript / pnpm / Luxon / Shadcn / Tailwind CSS / Mapcn / Zustand / Supabase 

## 🍼 Introduction
For a while I've been exploring Shadcn and Tailwind and discovered open source libraries built using Shadcn. I found Mapcn which uses MapLibre. After having built the first World City Timezone Search app through pure CSS, React-leaflet and designing components from scratch, I found an opportunity to improve the application and create a second version. Most of the features still exist but with minor changes and improvements.

## 🛠️ Features
- Search for world cities through querying the Supabase database
  - Handles region selection as some cities exist with same name and country  
    - E.g. Buffalo - United States 
  - Handles when not all cities are listed in the search all with the same name but are in different countries
    - E.g. San Jose 
- Displays city location on map
    - Map is interactive with zoom control for phone and desktop
    - Marker is placed where city is
- Responsive design - for both phone and desktop
- Display current time (which updates every minute)
    - Shows date, timezone, timezone id and location
- Displays main flag for the country the city is in
    - Shows second flag if a region or state does have one
- Light/Dark mode overlay on map - instant theme switching 

## 📚 Resources
- Luxon - https://moment.github.io/luxon/#/
- Shadcn - https://ui.shadcn.com/
- Mapcn - https://www.mapcn.dev/
- Tailwind - https://tailwindcss.com/
- Zustand - https://zustand-demo.pmnd.rs/

## 🪣 APIs / Data
- Country flags - https://flagpedia.net/download/api
- Timezone information - https://timezonedb.com/
- World city data - https://public.opendatasoft.com/explore/?sort=modified&q=Geonames+-+All+Cities


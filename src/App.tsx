import AdditionalLocationsModal from "@/components/modals/additionalLocationsModal";
import MapComponent from "@/components/map/mapComponent";
import MultipleSearchResultsModal from "@/components/modals/multipleSearchResultsModal";

function App() {
  return (
    <>
      <MapComponent />
      <AdditionalLocationsModal />
      <MultipleSearchResultsModal />
    </>
  );
}

export default App;
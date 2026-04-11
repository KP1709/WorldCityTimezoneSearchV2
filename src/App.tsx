import { AdditionalLocationsModal } from "@/components/additionalLocationsModal";
import MapComponent from "@/components/mapComponent";
import MultipleSearchResultsModal from "@/components/multipleSearchResultsModal";

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
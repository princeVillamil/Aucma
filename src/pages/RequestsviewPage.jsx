import FormsTable from "../components/FormsTable";
import placeHolderClients from "../assets/data/placeHolderClients";

export default function RequestsviewPage() {
  
  return (
    <FormsTable requests={placeHolderClients} />
  )
}
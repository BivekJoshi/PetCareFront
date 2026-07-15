import { useParams } from "react-router-dom";
import BusinessDetailView from "./BusinessDetailView";

const BusinessDetail = () => {
  const { slug } = useParams();
  return <BusinessDetailView slug={slug} interactive />;
};

export default BusinessDetail;

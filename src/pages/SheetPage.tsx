
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProblemDashboard from "@/components/ProblemDashboard";

const SheetPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();

  return (
    <Layout selectedSheet="dsa-sheets">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ProblemDashboard selectedSheet={sheetId || "striver-a2z"} searchQuery="" />
        </div>
      </div>
    </Layout>
  );
};

export default SheetPage;

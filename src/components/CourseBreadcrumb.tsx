
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface CourseBreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  showBackButton?: boolean;
  backUrl?: string;
}

const CourseBreadcrumb = ({ items, showBackButton = false, backUrl }: CourseBreadcrumbProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {item.href && index < items.length - 1 ? (
                  <BreadcrumbLink 
                    href={item.href}
                    className="text-gray-400 hover:text-white"
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-white">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator className="text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CourseBreadcrumb;

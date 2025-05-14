
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Filter, ArrowDownUp } from "lucide-react";
import { useState } from "react";

const PropertyFilters = () => {
  const [priceRange, setPriceRange] = useState([20, 80]);
  
  return (
    <div className="py-6 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="flex items-center mr-4 mb-2 sm:mb-0">
            <Filter size={16} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50lakh">Below 50 Lakh</SelectItem>
                <SelectItem value="50lakh-1cr">50 Lakh - 1 Cr</SelectItem>
                <SelectItem value="1cr-2cr">1 Cr - 2 Cr</SelectItem>
                <SelectItem value="2cr-5cr">2 Cr - 5 Cr</SelectItem>
                <SelectItem value="5cr+">5 Cr+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="BHK Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="5+">5+ BHK</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Furnishing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fully">Fully Furnished</SelectItem>
                <SelectItem value="semi">Semi Furnished</SelectItem>
                <SelectItem value="unfurnished">Unfurnished</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Construction Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rtr">Ready to Move</SelectItem>
                <SelectItem value="uc">Under Construction</SelectItem>
                <SelectItem value="newlaunch">New Launch</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Posted By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-primary text-white h-9">
              <ArrowDownUp size={14} className="mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;

import React, { useState } from "react";

const serviceCategories = [
  {
    name: "Chăm sóc da",
    services: [
      {
        category: "Chăm sóc da mặt",
        items: ["Chăm sóc da chuyên sâu", "Hút chì thải độc da"],
      },
      {
        category: "Tắm trắng",
        items: ["Tắm trắng phi thuyền"],
      },
      {
        category: "Tẩy lông",
        items: [
          "Triệt lông vĩnh viễn",
          "Triệt lông Laser",
          "Triệt lông mặt - ria mép",
          "Triệt râu quai nón",
          "Triệt lông lưng",
          "Triệt lông bụng",
          "Triệt lông bikini",
          "Triệt lông vùng kín cho nam giới",
          "Triệt lông ngực",
        ],
      },
    ],
  },
  {
    name: "Điều trị da",
    services: [
      {
        category: "Điều trị mụn",
        items: [
          "Trị mụn chuẩn y khoa",
          "Trị mụn đông trùng hạ thảo",
          "Trị mụn lưng",
        ],
      },
      {
        category: "Điều trị sẹo",
        items: ["Trị sẹo rỗ"],
      },
      {
        category: "Trẻ hóa da",
        items: ["Tiêm Filler"],
      },
    ],
  },
];

const ServiceDetail = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    serviceCategories[1]
  );

  return (
    <div className="w-full h-auto">
      <div
        className="absolute mt-4 left-1/2 -translate-x-1/2 -translate-y-4 w-[900px] bg-white shadow-lg rounded-lg border border-gray-200 flex"
        style={{ height: "400px" }}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        <div className="w-1/4 bg-pink-100 p-4 rounded-l-lg flex flex-col">
          {serviceCategories.map((category) => (
            <button
              key={category.name}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory.name === category.name
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500"
              }`}
              onMouseEnter={() => setSelectedCategory(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="w-3/4 p-6 overflow-auto">
          {selectedCategory.services.map((service, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-pink-600 font-semibold border-b pb-1 mb-2">
                {service.category}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-gray-700 text-sm">
                {service.items.map((item, i) => (
                  <span key={i} className="hover:text-pink-500 cursor-pointer">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

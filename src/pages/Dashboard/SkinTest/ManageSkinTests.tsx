import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, PlusIcon, SearchIcon } from "lucide-react";
import SkinTestService from "@/services/skin-test";

interface SkinTest {
  id: number;
  testName: string;
}

const ManageSkinTests: React.FC = () => {
  const [skinTests, setSkinTests] = useState<SkinTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  const navigate = useNavigate();

  const fetchSkinTests = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await SkinTestService.getSkinTests(page, pageSize);
      setSkinTests(response.data);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài kiểm tra da:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkinTests(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSkinTests(1, pageSize);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/skin-test/${id}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/skin-test/create");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <div className="flex gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={handleAddNew}
          >
            <PlusIcon size={16} />
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quiz Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : skinTests.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  No data found
                </td>
              </tr>
            ) : (
              skinTests.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{test.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{test.testName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      onClick={() => handleViewDetails(test.id)}
                    >
                      <EyeIcon size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSkinTests; 
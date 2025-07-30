import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import Modal from "../components/Modal";
import { Plus, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import companyService from "../supabase/dataConfig";
import { useSelector } from "react-redux";
import Logo from "../components/Logo";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [companies, setCompanies] = useState([]);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [joinCompanyId, setJoinCompanyId] = useState("");

  const [error, setError] = useState("");

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, [showCreateModal, showJoinModal]);

  const loadCompanies = async () => {
    if (!user) return;

    try {
      const userCompanies = await companyService.getUserCompanies(user.id);
      setCompanies(userCompanies);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!user || !newCompanyName.trim()) return;

    try {
      setError("");
      const data = await companyService.createCompany({
        name: newCompanyName.trim(),
        ownerId: user.id,
      });
      setNewCompanyName("");
      setShowCreateModal(false);
      loadCompanies();
    } catch (error) {
      setError("Failed to create company :: " + error);
    }
  };

  const handleJoinCompany = async (e) => {
    e.preventDefault();
    // if (!user || !joinCompanyId.trim()) return;

    try {
      setError("");
      await companyService.joinCompany({
        userId: user.id,
        companyId: joinCompanyId.trim(),
      });
      setJoinCompanyId("");
      setShowJoinModal(false);
      loadCompanies();
    } catch (error) {
      setError("Failed to join company. Please check the company ID.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Welcome back, {user?.user_metadata?.name || user?.email}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-gray-400">
              Manage your companies and expenses
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Company
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Join Company
            </button>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Logo className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-600" />
            <h3 className="mt-2 text-sm sm:text-base font-medium text-white">
              No companies
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Get started by creating a new company or joining an existing one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/CompanyDetail/${company.id}`)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Logo className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-white truncate">
                        {company.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {company.members_length} member
                        {company.members_length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <dt className="text-xs sm:text-sm font-medium text-gray-400">
                        Available Funds
                      </dt>
                      <dd className="text-xs sm:text-sm font-semibold text-green-400">
                        {formatCurrency(company.totalFunds)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs sm:text-sm font-medium text-gray-400">
                        Total Expenses
                      </dt>
                      <dd className="text-xs sm:text-sm font-semibold text-red-400">
                        {formatCurrency(company.totalExpenses)}
                      </dd>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-750 px-4 sm:px-6 py-2 sm:py-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span className="truncate">Company ID: {company.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Company"
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-300"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Join Company Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Company"
      >
        <form onSubmit={handleJoinCompany} className="space-y-4">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="companyId"
              className="block text-sm font-medium text-gray-300"
            >
              Company ID
            </label>
            <input
              type="text"
              id="companyId"
              value={joinCompanyId}
              onChange={(e) => setJoinCompanyId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company ID"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Join
            </button>
          </div>
        </form>
      </Modal>
    </AuthLayout>
  );
};

export default Dashboard;

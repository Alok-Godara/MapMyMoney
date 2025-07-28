import {
  ArrowLeft,
  IndianRupee,
  ReceiptIndianRupee,
  Users,
  TrendingUp,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import companyService from "../supabase/dataConfig";
import AuthLayout from "../components/AuthLayout";
import AddExpenseModal from "../components/AddExpenseModal";
import AddFundsModal from "../components/AddFundsModal";

const CompanyDetail = () => {
  const { companyId } = useParams();

  const user = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [funds, setFunds] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (companyId && user.isLoggedIn) {
      loadCompanyData();
    }
  }, [companyId, user.isLoggedIn]);

  const isOwner = user && company && user.user.id === company.owner_id;

  const loadCompanyData = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const companyData = await companyService.getCompanyById(companyId);

      if (!companyData) {
        navigate("/dashboard");
        return;
      }

      setCompany(companyData);

      const expenseData = await companyService.getCompanyExpenses(companyId);
      const fundData = await companyService.getCompanyFunds(companyId);
      const companyUsers = await companyService.getCompanyUsers(companyId);

      setExpenses(expenseData);

      setFunds(fundData);

      setCompanyUsers(companyUsers);
    } catch (error) {
      console.error("Error loading company data:", error);
      // Optionally navigate to dashboard if company not found
      if (error.message?.includes("No rows") || error.code === "PGRST116") {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReimburse = async (expenseId) => {
    if (!isOwner) return;

    try {
      const response = await companyService.markReimbursement(
        expenseId,
        user.user.id,
        "Reimbursed"
      );
      await loadCompanyData(); // reload UI
    } catch (error) {
      console.error("Error reimbursing expense:", error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-red-400";
      case "reimbursed":
        return "text-green-400";
      case "partial":
        return "text-amber-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reimbursed":
        return <CheckCircle className="h-4 w-4" />;
      case "partial":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) => statusFilter === "all" || expense.status === statusFilter
  );

  if (!user.isLoggedIn) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  if (!company) {
    return (
      <AuthLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-white">Company not found</h3>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-blue-500 hover:text-blue-400"
          >
            Return to Dashboard
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={company.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white">{company.name}</h2>
              <p className="text-gray-400">Company ID: {company.id}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddExpense(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ReceiptIndianRupee className="h-4 w-4 mr-2" />
              Add Expense
            </button>
            {isOwner && (
              <button
                onClick={() => setShowAddFunds(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <IndianRupee  className="h-4 w-4 mr-2" />
                Add Funds
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {["overview", "expenses", "funds", "members"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <IndianRupee  className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Available Funds
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(company.totalFunds)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(company.totalExpenses)}
                    </p>
                  </div>
                </div>
              </div>

              {/** Pending Reimbursements */}
              {/* <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-amber-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(company.totalPendingReimbursements)}
                    </p>
                  </div>
                </div>
              </div> */}

              {/** Reimbursed Amount */}
              {/* <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Reimbursed
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(company.totalReimbursed)}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Recent Expenses */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Recent Expenses
              </h3>
              <div className="space-y-4">
                {expenses.length > 0 ? (
                  expenses.slice(0, 5).map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(expense.status)}
                        <div>
                          <p className="text-white font-medium">
                            {expense.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {expense.paidByName} • {formatDate(expense.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p
                          className={`text-sm capitalize ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {expense.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No expenses yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="reimbursed">Reimbursed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div key={expense.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(expense.status)}
                          <h3 className="text-lg font-medium text-white">
                            {expense.title}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-200 rounded-full">
                            {expense.type}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-2">
                          {expense.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {expense.paidByName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(expense.date)}
                          </span>
                        </div>
                        {expense.receipt_url && (
                          <div className="mt-3">
                            <img
                              src={expense.image_url}
                              alt="Receipt"
                              className="h-20 w-20 object-cover rounded-md border border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-xl font-bold text-white mb-1">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p
                          className={`text-sm capitalize font-medium ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {expense.status}
                        </p>
                        {expense.reimbursed_amount && (
                          <p className="text-sm text-gray-400">
                            Reimbursed:{" "}
                            {formatCurrency(expense.reimbursed_amount)}
                          </p>
                        )}
                        {isOwner && expense.status === "pending" && (
                          <button
                            onClick={() =>
                              handleReimburse(expense.id, expense.amount)
                            }
                            className="mt-2 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                          >
                            Mark Reimbursed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No expenses found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "funds" && (
          <div className="space-y-4">
            {funds.length > 0 ? (
              funds.map((fund) => (
                <div key={fund.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-white">
                        {formatCurrency(fund.amount)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Added by {fund.addedByName} •{" "}
                        {formatDate(fund.createdAt)}
                      </p>
                      {fund.note && (
                        <p className="text-gray-300 mt-2">{fund.note}</p>
                      )}
                    </div>
                    <IndianRupee  className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No funds added yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Members ({company.members_length || 0})
            </h3>
            <div className="space-y-3">
              {company.members_length > 0 ? (
                companyUsers.map((user) => (
                  <div
                    key={user.users.id}
                    className="flex items-center space-x-3"
                  >
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-white">
                      Member : {user.users.name}
                    </span>
                    {user.users.id === company.owner_id && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-200 rounded-full">
                        Owner
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No members found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {companyId && (
        <>
          <AddExpenseModal
            isOpen={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            companyId={companyId}
            onExpenseAdded={loadCompanyData}
          />
          {isOwner && (
            <AddFundsModal
              isOpen={showAddFunds}
              onClose={() => setShowAddFunds(false)}
              companyId={companyId}
              onFundsAdded={loadCompanyData}
            />
          )}
        </>
      )}
    </AuthLayout>
  );
};

export default CompanyDetail;

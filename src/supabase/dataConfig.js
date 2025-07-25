// src/services/companyService.js
import { supabase } from "./supabaseClient";

export class CompanyService {
  // 1. Create a new company
  async createCompany({ name, description, ownerId }) {
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name, description, owner_id: ownerId }]);
    if (error) throw error;
    return data;
  }

  // 2. Update company details
  async updateCompany(companyId, updates) {
    const { data, error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", companyId);
    if (error) throw error;
    return data;
  }

  // 3. Delete a company
  async deleteCompany(companyId) {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", companyId);
    if (error) throw error;
    return true;
  }

  // 4. Join a company
  async joinCompany({ userId, companyId }) {
    const { data, error } = await supabase
      .from("company_members")
      .insert([{ user_id: userId, company_id: companyId }]);
    if (error) throw error;
    return data;
  }

  // 5. Leave a company
  async leaveCompany({ userId, companyId }) {
    const { error } = await supabase
      .from("company_members")
      .delete()
      .match({ user_id: userId, company_id: companyId });
    if (error) throw error;
    return true;
  }

  // 6. Add an expense
  async addExpense(expense) {
    const { data, error } = await supabase.from("expenses").insert([expense]);
    if (error) throw error;
    return data;
  }

  // 7. Edit an expense
  async updateExpense(expenseId, updates) {
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", expenseId);
    if (error) throw error;
    return data;
  }

  // 8. Delete an expense
  async deleteExpense(expenseId) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId);
    if (error) throw error;
    return true;
  }

  // 9. Add funds
  async addFund(fund) {
    const { data, error } = await supabase.from("funds").insert([fund]);
    if (error) throw error;
    return data;
  }

  // 10. Update fund details
  async updateFund(fundId, updates) {
    const { data, error } = await supabase
      .from("funds")
      .update(updates)
      .eq("id", fundId);
    if (error) throw error;
    return data;
  }

  // 11. Mark reimbursement status
  async markReimbursement(expenseId, status) {
    const { data, error } = await supabase
      .from("expenses")
      .update({ reimbursed: status })
      .eq("id", expenseId);
    if (error) throw error;
    return data;
  }

  // 12. Get company by ID with details
  async getCompanyById(companyId) {
    const { data, error } = await supabase
      .from("companies")
      .select(`
        *,
        company_members(user_id),
        expenses(*),
        funds(*)
      `)
      .eq("id", companyId)
      .single();
    
    if (error) throw error;
    
    // Calculate totals
    const totalFunds = data.funds?.reduce((sum, fund) => sum + fund.amount, 0) || 0;
    const totalExpenses = data.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    const totalReimbursed = data.expenses?.reduce((sum, expense) => 
      sum + (expense.reimbursed_amount || 0), 0) || 0;
    const totalPendingReimbursements = data.expenses?.reduce((sum, expense) => 
      expense.status === 'pending' ? sum + expense.amount : sum, 0) || 0;
    
    return {
      ...data,
      members: data.company_members?.map(m => m.user_id) || [],
      totalFunds,
      totalExpenses,
      totalReimbursed,
      totalPendingReimbursements
    };
  }

  // 13. Get company expenses
  async getCompanyExpenses(companyId) {
    const { data, error } = await supabase
      .from("expenses")
      .select(`
        *,
        profiles:paid_by(name)
      `)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(expense => ({
      ...expense,
      paidByName: expense.profiles?.name || 'Unknown User',
      date: new Date(expense.created_at)
    }));
  }

  // 14. Get company funds
  async getCompanyFunds(companyId) {
    const { data, error } = await supabase
      .from("funds")
      .select(`
        *,
        profiles:added_by(name)
      `)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(fund => ({
      ...fund,
      addedByName: fund.profiles?.name || 'Unknown User',
      createdAt: new Date(fund.created_at)
    }));
  }

  // 15. Reimburse expense
  async reimburseExpense(companyId, expenseId, amount, reimburserUserId) {
    const { data, error } = await supabase
      .from("expenses")
      .update({ 
        status: 'reimbursed',
        reimbursed_amount: amount,
        reimbursed_by: reimburserUserId,
        reimbursed_at: new Date().toISOString()
      })
      .eq("id", expenseId)
      .eq("company_id", companyId);
    
    if (error) throw error;
    return data;
  }
}

const companyService = new CompanyService();

export default companyService;

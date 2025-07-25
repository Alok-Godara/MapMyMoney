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
}

const companyService = new CompanyService();

export default companyService;

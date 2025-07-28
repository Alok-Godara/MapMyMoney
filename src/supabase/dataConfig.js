// src/services/companyService.js
import { supabase } from "./supabaseClient";

export class CompanyService {
  // 1. Create a new company
  async createCompany({ name, ownerId }) {
    try {
      // First, create the company and get the returned data
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([
          {
            name,
            owner_id: ownerId,
            totalFunds: 0,
            totalExpenses: 0,
            members_length: 1,
          },
        ])
        .select() // This ensures we get the inserted data back
        .single(); // Get single object instead of array

      if (companyError) {
        console.log("Error creating company :: ", companyError);
        throw companyError;
      }

      // Then, add the owner to company_users table
      const { data: companyUsersData, error: companyUsersError } =
        await supabase
          .from("company_users")
          .insert([{ user_id: ownerId, company_id: companyData.id }])
          .select();

      if (companyUsersError) {
        console.log("Error adding user to company :: ", companyUsersError);
        throw companyUsersError;
      }

      return companyData;
    } catch (error) {
      console.error("CreateCompany error :: ", error);
      throw error;
    }
  }

  // // 2. Update company details
  // async updateCompany(companyId, updates) {
  //   const { data, error } = await supabase
  //     .from("companies")
  //     .update(updates)
  //     .eq("id", companyId);
  //   if (error) throw error;
  //   return data;
  // }

  // // 3. Delete a company
  // async deleteCompany(companyId) {
  //   const { error } = await supabase
  //     .from("companies")
  //     .delete()
  //     .eq("id", companyId);
  //   if (error) throw error;
  //   return true;
  // }

  // 4. Join a company
  async joinCompany({ userId, companyId }) {
    const { data, error } = await supabase
      .from("company_users")
      .insert([{ user_id: userId, company_id: companyId }]);

    if (error) throw "Error updating Company_Users :: " + error;

    // Increment members_length by 1
    const { data: companyData, error: fetchError } = await supabase
      .from("companies")
      .select("members_length")
      .eq("id", companyId)
      .single();

    if (fetchError)
      throw "Error fetching current members_length :: " + fetchError;

    const newLength = (companyData?.members_length || 0) + 1;

    const { error: updateError } = await supabase
      .from("companies")
      .update({ members_length: newLength })
      .eq("id", companyId);

    if (updateError) throw "Error updating members_length :: " + updateError;

    return data;
  }

  // // 5. Leave a company
  // async leaveCompany({ userId, companyId }) {
  //   const { error } = await supabase
  //     .from("company_users")
  //     .delete()
  //     .match({ user_id: userId, company_id: companyId });

  //   if (error) throw error;

  //   // Decrement members_length by 1
  //   const { error: updateError } = await supabase
  //     .from("companies")
  //     .update({ members_length: supabase.sql`members_length - 1` })
  //     .eq("id", companyId);

  //   if (updateError) throw "Error updating members_length :: " + updateError;

  //   return true;
  // }

  // 6. Add an expense
  async addExpense(companyId, expense) {
    // Insert the expense
    const { data, error } = await supabase.from("expenses").insert([
      {
        ...expense,
        company_id: companyId,
      },
    ]);
    if (error) throw "Error inserting expense :: " + error;

    // Fetch current totalExpenses
    const { data: companyData, error: fetchError } = await supabase
      .from("companies")
      .select("totalExpenses")
      .eq("id", companyId)
      .single();

    if (fetchError) throw "Error fetching totalExpenses :: " + fetchError;

    const currentTotal = companyData?.totalExpenses || 0;
    const newTotal = currentTotal + expense.amount;

    // Update totalExpenses with new value
    const { error: updateError } = await supabase
      .from("companies")
      .update({ totalExpenses: newTotal })
      .eq("id", companyId);

    if (updateError) throw "Error updating totalExpenses :: " + updateError;

    return data;
  }

  // // 7. Edit an expense
  // async updateExpense(expenseId, updates) {
  //   const { data, error } = await supabase
  //     .from("expenses")
  //     .update(updates)
  //     .eq("id", expenseId);
  //   if (error) throw error;
  //   return data;
  // }

  // // 8. Delete an expense
  // async deleteExpense(expenseId) {
  //   const { error } = await supabase
  //     .from("expenses")
  //     .delete()
  //     .eq("id", expenseId);
  //   if (error) throw error;
  //   return true;
  // }

  // 9. Add funds
  async addFund(companyID, fund) {
    const { data, error } = await supabase
      .from("funds")
      .insert([{ ...fund, company_id: companyID }]);
    if (error) throw error;

    // Update the company's total funds
    const { data: companyData, error: fetchError } = await supabase
      .from("companies")
      .select("totalFunds")
      .eq("id", companyID)
      .single();

    if (fetchError) throw fetchError;

    const newTotal = companyData.totalFunds + fund.amount;

    const { error: updateError } = await supabase
      .from("companies")
      .update({ totalFunds: newTotal })
      .eq("id", companyID);

    if (updateError) throw updateError;

    return data;
  }

  // // 10. Update fund details
  // async updateFund(fundId, updates) {
  //   const { data, error } = await supabase
  //     .from("funds")
  //     .update(updates)
  //     .eq("id", fundId);
  //   if (error) throw error;
  //   return data;
  // }

  // 11. Mark reimbursement status
  async markReimbursement(expenseId, userId, status) {
    const { data, error } = await supabase
      .from("expenses")
      .update({ status: status, user_id: userId })
      .eq("id", expenseId);
    if (error) throw error;
    return "done";
  }

  // 12. Get company by ID with details
  async getCompanyById(companyId) {
    const { data, error } = await supabase
      .from("companies")
      .select(
        `
        *,
        company_users(user_id),
        expenses(*),
        funds(*)
      `
      )
      .eq("id", companyId)
      .single();

    if (error) throw error;

    return {
      ...data,
    };
  }

  // 13. Get company expenses
  async getCompanyExpenses(companyId) {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        *,
        users:user_id(name)
      `
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((expense) => ({
      ...expense,
      paidByName: expense.users?.name || "Unknown User",
      date: new Date(expense.created_at),
    }));
  }

  // 14. Get company funds
  async getCompanyFunds(companyId) {
    const { data, error } = await supabase
      .from("funds")
      .select(
        `
        *,
        users:user_id(name)
      `
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((fund) => ({
      ...fund,
      addedByName: fund.users?.name || "Unknown User",
      createdAt: new Date(fund.created_at),
    }));
  }

  // 15. Reimburse expense when partial is returned
  // async reimburseExpense(companyId, expenseId, amount, reimburserUserId) {
  //   const { data, error } = await supabase
  //     .from("expenses")
  //     .update({
  //       status: "reimbursed",
  //       reimbursed_amount: amount,
  //       reimbursed_by: reimburserUserId,
  //       reimbursed_at: new Date().toISOString(),
  //     })
  //     .eq("id", expenseId)
  //     .eq("company_id", companyId);

  //   if (error) throw error;
  //   return data;
  // }

  async getUserCompanies(userId) {
    const { data, error } = await supabase
      .from("company_users")
      .select("company_id")
      .eq("user_id", userId);

    if (error)
      throw "Error fetching user companies from company_users:: " + error;

    const companyIds = data.map((member) => member.company_id);
    if (companyIds.length === 0) return [];

    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .in("id", companyIds);

    if (companiesError)
      throw "Error fetching companies from companies :: " + companiesError;

    return companies;
  }

  async getCompanyUsers(companyId) {
    const { data, error } = await supabase
      .from("company_users")
      .select(
        `
        users : user_id(id, name)
        `
      )
      .eq("company_id", companyId);

    if (error) throw "Error fetching company members :: " + error;

    return data;
  }

  async getUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw "Error fetching user by ID :: " + error;

    return data;
  }
}

const companyService = new CompanyService();

export default companyService;

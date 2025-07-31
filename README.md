# MapMyMoney 🧾💸

**MapMyMoney** is a collaborative expense tracking and fund management app. It allows users to create or join companies, add and manage expenses, contribute funds, and track reimbursements—making it ideal for startups, clubs, roommates, or any group sharing finances.

---

## 🚀 Features

- 🔐 **Authentication** via email/password or Google Login (using Supabase)
- 🏢 **Company Management**
  - Create, update, and delete companies
  - Join or leave a company
- 💰 **Expense Management**
  - Add, edit, and delete expenses with optional image upload
  - Filter expenses by user or company
- 🧾 **Fund Contributions**
  - Add or update fund details for a company
- ✅ **Reimbursement Tracking**
  - Mark expenses as `pending` or `done`
- 🧑‍🤝‍🧑 Multiple users per company
- ☁️ Built on **Supabase** (PostgreSQL, Auth, and Storage)

---

## 📦 Tech Stack

- **Frontend**: React Native (with Expo)
- **State Management**: Redux
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Image Storage**: Supabase Storage

---

## 🧾 Database Schema (Supabase SQL)

```sql
-- USERS table
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique
);

-- COMPANIES table
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text,
  owner_id uuid references users(id)
);

-- EXPENSES table
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  company_id uuid references companies(id),
  amount numeric,
  description text,
  image_url text,
  status text check (status in ('pending', 'done')) default 'pending',
  created_at timestamp default now()
);
```

---

## 🔐 Supabase Auth Setup

- Enable **Email/Password** and **Google** provider in Supabase Auth.
- Create a `.env` file and store your:
  ```env
  SUPABASE_URL=your-supabase-url
  SUPABASE_ANON_KEY=your-anon-key

---

## 🖼️ Image Upload
- Images for expenses are uploaded using Supabase Storage.
- A public bucket is used to generate preview links for images.

---

## 🧠 Project Philosophy
- Financial transparency within teams and groups can improve trust, reduce conflicts, and help build sustainable communities.
- MapMyMoney brings that transparency with simplicity.

---

## 🧪 Future Improvements
- Notifications for expenses or reimbursements
- Monthly reports for each company
- Role-based permissions (Admins, Members)
- Export to CSV/PDF

---

## 🤝 Contributing
- Feel free to fork, suggest features, or report bugs via GitHub Issues.


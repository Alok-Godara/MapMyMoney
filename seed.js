const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = getFirestore();

async function seed() {
  // Sample user
  const userRef = db.collection("users").doc("user123");
  await userRef.set({
    name: "John Doe",
    email: "john@example.com",
    joinedCompanies: ["company123"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Sample company
  const companyRef = db.collection("companies").doc("company123");
  await companyRef.set({
    name: "Team Alpha",
    ownerId: "user123",
    members: ["user123", "user456"],
    fundsAvailable: 10000,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Sample expense
  const expenseRef = companyRef.collection("expenses").doc();
  await expenseRef.set({
    title: "Hosting Bill",
    description: "AWS monthly charge",
    amount: 1500,
    type: "Infrastructure",
    date: "2025-07-24",
    createdBy: "user123",
    reimbursementStatus: "pending",
    reimbursedAmount: 0,
    receiptImageUrl: "",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Sample reimbursement
  const reimbursementRef = companyRef.collection("reimbursements").doc();
  await reimbursementRef.set({
    expenseId: expenseRef.id,
    userId: "user123",
    amount: 1500,
    status: "pending",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("✅ Database seeded successfully.");
}

seed().catch(console.error);

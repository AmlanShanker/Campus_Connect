export const seedUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@campus.edu",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Amlan Shanker",
    email: "student@campus.edu",
    password: "student123",
    role: "student",
  },
];

export function fetchUsers() {
  return Promise.resolve(seedUsers);
}

# 4PS-Nexus 🛡️

A blockchain-based disbursement system for the Philippine **4Ps (Pantawid Pamilyang Pilipino Program)**. Powered by the **Stellar Network** and **Soroban Smart Contracts**, 4PS-Nexus uses programmable money to ensure government funds are spent only on approved essentials, eliminating corruption, and enforcing transparency.

## 🚀 The Problem We're Solving
The current implementation of the 4Ps cash transfer program faces challenges such as:
- **Misallocation of Funds:** Beneficiaries sometimes spend the cash grants on non-essentials (e.g., gambling, alcohol) instead of education and health.
- **Lack of Transparency:** Hard to track exactly where the government funds are going once disbursed.
- **Compliance Tracking:** Difficult to efficiently verify if families are meeting the conditional requirements (school attendance, health checkups).

## 💡 Our Solution
By leveraging **Stellar** and **Soroban Smart Contracts**, we tokenize the Philippine Peso into **4P-Tokens** (Programmable Money). 
- Funds cannot be withdrawn as cash. 
- They can only be transferred to **Whitelisted Accredited Merchants** (e.g., pharmacies, accredited groceries, school supply stores).
- Smart contracts automatically clawback or freeze funds if the beneficiary fails to meet the conditional compliance requirements.

## ✨ Key Features
- **Beneficiary Portal:** A clean, mobile-first dashboard where beneficiaries can track their available balance, view their transaction history, and check their compliance status.
- **Smart Compliance Tracker:** Gamified dashboard tracking children's school attendance, monthly health checkups, and Family Development Sessions (FDS).
- **Merchant Directory & Map:** Built-in integration to find nearby accredited merchants.
- **Disbursement Hub (DSWD):** A portal for government agencies to release funds, manage whitelists, and monitor macro-level analytics.
- **Freighter Wallet Integration:** Secure authentication and transaction signing using the Freighter extension.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Icons & UI:** Lucide React, Glassmorphism aesthetics
- **Blockchain:** Stellar Network, Soroban Smart Contracts
- **Wallet Auth:** `@stellar/freighter-api` v6.x

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- [Freighter Wallet](https://4-ps-nexus.vercel.app/) Browser Extension installed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dranyl-23/4PS-Nexus.git
cd 4PS-Nexus
```

2. Navigate to the web frontend directory:
```bash
cd web
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://4-ps-nexus.vercel.app) in your browser.

## 🏆 Hackathon Project
This project was built during a hackathon to demonstrate the power of Stellar's ecosystem and smart contracts in solving real-world government infrastructure and financial inclusion problems in the Philippines.

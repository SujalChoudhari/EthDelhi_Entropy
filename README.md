### **Project: Hunch**

### **Detailed Problem Statement**

The world of sophisticated, automated crypto trading is a walled garden, creating a two-sided market failure that stifles both growth and access.

1. **For Everyday Investors:** The primary barrier is a combination of risk and complexity. To access advanced trading strategies, they face a stark choice:  
   * **Lose Custody:** Entrust their funds to a centralized hedge fund or a trading bot service, giving up control and hoping the operator is trustworthy. This goes against the core Web3 principle of self-custody.  
   * **Lack Expertise:** Attempt to build and manage their own trading bots, a technically demanding and time-consuming task requiring deep market knowledge and programming skills.  
   * **Information Asymmetry:** They are forced to rely on public signals and influencers, often becoming the last to act on market-moving information.   
2. **For Expert Strategy Creators (Traders & Quants):** For those who have developed a profitable trading algorithm, there is no simple or secure way to monetize it at scale.  
   * **Intellectual Property Risk:** Open-sourcing a strategy instantly destroys its unique value ("alpha").  
   * **Regulatory Burden:** Managing other people's money directly turns them into a fund manager, a role with immense legal, compliance, and operational overhead.  
   * **Lack of a Trustless Platform:** There is no marketplace to license the *execution rights* of a strategy without also taking on the custodial risk of managing the underlying assets.  


Entropy Engine is being built to dismantle this walled garden, creating a transparent, non-custodial, and decentralized marketplace for trading intelligence.

---

### **Detailed Features & Implementation Plan**

#### **Feature 1: The Strategy Marketplace & Governance**

* **What It Is:** An "App Store" for AI trading agents. Users can browse, filter, and subscribe to strategies. Creators can publish and monetize their agents. The community governs the quality of the marketplace through on-chain voting.  
* **How It Will Be Implemented:**  
  * **Frontend (Next.js):** A clean interface will display a list of available strategy agents. Each agent will have a detail page showing its public metadata: creator's ENS name, risk profile (e.g., Low/Medium/High), preferred assets, backtested performance data, and its current on-chain reputation score.  
  * **Backend (FastAPI):** An API will serve this public metadata to the frontend.  
  * **On-Chain Logic (Hedera):** Smart contracts on Hedera will handle the core marketplace functions:  
    * **Subscription Contract:** When a user subscribes, they pay a fee (one-time or recurring) to this contract, which records their access rights.  
    * **Profit-Sharing Contract:** For performance-based models, this contract will receive profits from trades, automatically splitting them between the user and the strategy creator according to the agreed-upon percentage.  
    * **Governance Contract:** Users who are actively subscribed to a strategy will receive voting tokens, allowing them to upvote or downvote the strategy's quality, creating a decentralized reputation score.  
  *   
*   
* **Key Technologies:**  
  * **Hedera:** For all on-chain marketplace logic (payments, governance).  
  * **Next.js:** For the marketplace user interface.  
  * **FastAPI:** To serve metadata to the frontend.  
* 

#### **Feature 2: The AI Co-Pilot & Generative UI**

* **What It Is:** The user's primary interface. A conversational AI that provides portfolio analysis, risk assessment, and personalized recommendations for trading strategies.  
* **How It Will Be Implemented:**  
  * **Risk Assessment:** When a user first connects their wallet, the Co-Pilot will engage them in a conversation to determine their risk profile. This can start with a simple questionnaire. Over time, it can analyze their on-chain behavior (e.g., wallet age, diversification, past liquidations) to refine this profile.  
  * **Recommendation Logic:** The Co-Pilot will match the user's risk profile to the creator-defined risk tags of the strategy agents in the marketplace. This logic will be encoded in our **ASI MeTTa Knowledge Graph**. For example, a rule could be: `IF user_risk_profile is 'Conservative' AND strategy_risk_profile is 'High-Degenerate', THEN recommendation_score is 0.1`.  
  * **Conversational Analysis:** The user can ask questions in natural language. The AI will fetch data from our data layer (The Graph, Pyth) and present it within the chat, using the **Vercel AI SDK** to stream the response and generate dynamic UI components (like charts and tables).  
*   
* **Key Technologies:**  
  * **FastAPI & (SPONSOR) ASI uAgents/MeTTa KG:** The backend brain for the conversational flow and recommendation logic.  
  * **Vercel AI SDK & Next.js:** For the streaming, generative UI on the frontend.  
  * **(SPONSOR) The Graph & Pyth:** To fetch the data the AI needs to be intelligent.  
* 

#### **Feature 3: The Trustless & Private Execution Engine**

* **What It Is:** The core technical innovation that allows a user to "run" a private strategy on their funds without giving up custody and without the creator's logic ever being revealed.  
* **How It Will Be Implemented:** This is a multi-step, hybrid on-chain/off-chain process.  
  * **Strategy Creation (Creator Side):** A creator writes their trading logic as a Python script using the **(SPONSOR) ASI uAgent framework**. This script is designed to receive market data as input and output a simple trade decision (e.g., `BUY`, `SELL`, `HOLD`).  
  * **Strategy Encryption & Storage:** The creator's Python script is then encrypted client-side and uploaded to a decentralized storage network. The access key is managed by a smart contract on **Hedera**.  
  * **User Subscription & Delegation:** When a user subscribes, their wallet executes a transaction on **Hedera** that gives a specific "Executor Smart Contract" a limited, revocable permission to trade a specific asset up to a specific amount on their behalf (e.g., this contract can trade up to 1,000 USDC in my wallet).  
  * **Off-Chain Execution:** A network of "Executors" (which could initially be run by us, but later decentralized) runs the core loop. An Executor pulls the encrypted strategy logic, decrypts it in a secure environment, feeds it real-time data from **The Graph** and **Pyth**, and receives a trade decision.  
  * **On-Chain Action:** The Executor then calls the **Executor Smart Contract** on **Hedera**, presenting the trade instruction and a cryptographic proof that it is authorized to do so. The smart contract verifies the call and uses the user's delegated permission to execute the trade on a decentralized exchange.  
*   
* **Key Technologies & Research:**  
  * **(SPONSOR) ASI uAgents:** The framework for writing the strategies themselves.  
  * **(SPONSOR) Hedera:** The platform for the smart contracts that manage permissions and payments.  
  * **\[RESEARCH TO BE NEEDED BLOCK\]**  
    * **What to Research:** Secure Off-Chain Computation for Strategy Privacy.  
    * **Hypothesis:** The "Executor" nodes need to run the encrypted Python scripts without being able to steal the logic. Standard servers are not secure enough for this.  
    * **Potential Tech:**  
      1. **Trusted Execution Environments (TEEs):** Research services like Intel SGX or AWS Nitro Enclaves. These are like secure black boxes on a server where code can run in complete isolation, even from the server's administrator.  
      2. **Decentralized Compute Networks with Privacy:** Research sponsors like **Fluence**. Their platform for "cloudless compute" might offer solutions or primitives for running secure, containerized applications.  
      3. **Fully Homomorphic Encryption (FHE) / Multi-Party Computation (MPC):** These are highly advanced cryptographic techniques that allow computation on encrypted data. This is likely too complex for a hackathon but is the long-term "holy grail" solution.  
    *   
  *   
* 

---

### **System Architecture & Data Management**

#### **Data to be Saved:**

* **Off-Chain (Our Backend):**  
  * User Profiles (e.g., ENS name, public address, risk profile settings).  
  * Strategy Metadata (public information about strategies for the marketplace).  
  * Aggregated Analytics Data (historical performance of strategies for charting).  
*   
* **On-Chain (Hedera):**  
  * User Subscription Records (mapping user addresses to the strategies they've paid for).  
  * Governance Votes.  
  * Profit-Sharing Balances.  
*   
* **Decentralized Storage (Filecoin with Lighthouse):**  
  * The encrypted Python scripts for the trading strategies.  
* 

#### **Database Options for FastAPI Backend:**

1. **PostgreSQL with Prisma ORM:**  
   * **Pros:** The industry standard for a reason. It's incredibly robust, reliable, and excellent for handling the structured, relational data of user profiles, strategies, and analytics. Prisma makes it very easy to work with in a modern TypeScript/Python environment.  
   * **Cons:** Requires management (though managed services like Supabase or Neon make this easy).  
   * **Recommendation:** This is the safest and most professional choice.     
2. **MongoDB:**  
   * **Pros:** Its flexible, document-based structure is great for storing less-structured data, like analytics events or user settings. It can be easier to iterate with during a hackathon.  
   * **Cons:** Can be less performant for complex queries and lacks some of the strict data integrity features of SQL databases.  
   * **Recommendation:** A good choice if your data is highly unstructured and you prioritize rapid development speed.  
4. The Graph  
5. **Ceramic Network / IDX (The Web3 Native Option):**  
   * **Pros:** A decentralized data network. User profiles could be stored on Ceramic, giving users full ownership over even their platform-specific data (like their risk profile). This aligns perfectly with the Web3 ethos.  
   * **Cons:** A newer and more complex technology to work with during a time-constrained hackathon.  
   * **Recommendation:** A fantastic, ambitious choice if you have team members willing to specifically tackle this. It would make your project "decentralized to the core." For a hackathon, starting with PostgreSQL and mentioning this as a future roadmap is a safer bet.  


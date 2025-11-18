# Charge Card Tutorial - Implementation Plan

## Overview
Convert `enfuce-docs.md` (an integration guide) into a step-by-step Charge Card tutorial at `tutorials/digital-banking/charge-card.mdx`.

**Key Requirements:**
- Replace all "Enfuce" references with "Acme"
- Keep only cURL examples (no TypeScript SDK)
- Convert integration guide format to tutorial format with clear, actionable instructions
- Work section by section, waiting for approval before proceeding

---

## Section Breakdown

### Section 1: Foundation
**Status:** Pending approval

**Content:**
- Create file: `tutorials/digital-banking/charge-card.mdx`
- Frontmatter:
  - title: "Building a Charge Card System"
  - sidebarTitle: "Charge card"
  - description: "Learn how to implement a charge card payment system..."
  - og:title and og:description
- Overview section:
  - Explain what users will learn (6 key points)
  - List capabilities: card authorization, fee accrual, billing cycles, invoice settlement
- Designing your map section:
  - Use mermaid diagram from source (replace Enfuce with Acme)
  - Explain the complete lifecycle
  - Describe each component
- Set up your implementation section:
  - List the 6 main steps we'll implement (merged ATM into card authorization)
- Prerequisites section:
  - Running Blnk server
  - API key
  - Blnk CLI or Cloud workspace

**Source Material:** Lines 1-27 from enfuce-docs.md

---

### Section 2: Create Card Account and Sub-Balances
**Status:** Pending approval

**Content:**
- Create a ledger
  - Explanation and cURL example
  - Warning to save ledger_id
- Create customer identity
  - Explanation and cURL example
  - Warning to save identity_id
- Create sub-balances (6 total):
  - card_primary (main charge card balance)
  - fees_payable (fees accrued in billing cycle)
  - transaction_interest (interest on pending transactions)
  - billed_balance (principal to be billed)
  - overdue_balance (overdue principal)
  - overdue_interest (interest on overdue)
  - Each with explanation and cURL example
- Warning to save all balance_id values
- Related topics cards for ledgers, identities, balances

**Source Material:** Lines 28-89 from enfuce-docs.md

---

### Section 3: Authorize Card and ATM Transactions
**Status:** Pending approval

**Content:**
- How card authorization works (4-step explanation)
- Create an inflight transaction
  - Explanation of overdraft limit
  - cURL example with $5,000 limit
  - Tip about testing with amount exceeding limit
- Understanding available balance
  - Explanation of how Blnk calculates remaining balance
  - Example calculation
- ATM transactions
  - Explanation that ATM transactions use same workflow
  - Example ATM withdrawal
    - cURL example
    - Explanation of why it succeeds/fails
  - Note about automatic rejection if exceeding available balance
- Related topics cards:
  - Managing insufficient funds
  - Overdrafts
  - Inflight transactions
  - Internal balances

**Source Material:** Lines 92-155 from enfuce-docs.md

---

### Section 4: Accrue Fees and Interest
**Status:** Pending approval

**Content:**
- Introduction explaining why fees/interest are recorded as overdraft
- Calculate and record markup fees
  - Explanation of 1.5% markup
  - cURL example (replace @EnfuceFees with @AcmeFees)
  - Tip about linking to original transaction
- Record transaction interest
  - Explanation of periodic accrual
  - cURL example (replace @EnfuceInterestAccrued with @AcmeInterestAccrued)
  - Note about calculating actual interest amounts

**Source Material:** Lines 158-210 from enfuce-docs.md

---

### Section 5: Clearing Transactions
**Status:** Pending approval

**Content:**
- Explanation of clearing process
- Commit the inflight transaction
  - Explanation of turning inflight to APPLIED
  - cURL example to commit
- Handle fee recalculation
  - Explanation of refunding and reposting
  - cURL examples for refund and recalculated transaction
- Note about stopping interest accrual once cleared
- Related topics cards:
  - Applying inflight
  - Refund transactions

**Source Material:** Lines 214-269 from enfuce-docs.md

---

### Section 6: End of Billing Cycle
**Status:** Pending approval

**Content:**
- Explanation of billing cycle end process
- Retrieve completed transactions
  - Explanation of using Search API
  - cURL example with date filtering
- Update billed_balance
  - Explanation of mirroring card_primary
  - cURL example
- Note about leaving card_primary untouched
- Explanation of balance states during billing cycle
  - List negative balances and what they represent
- Related topics card:
  - Search API

**Source Material:** Lines 272-330 from enfuce-docs.md

---

### Section 7: Overdue Invoice Handling
**Status:** Pending approval

**Content:**
- Explanation of overdue process
- Move balance from billed_balance to overdue_balance
  - Explanation of zeroing out billed balance
  - cURL example
- Record overdue interest
  - Explanation of accruing interest on overdue amounts
  - cURL example (replace @EnfuceInterestAccrued with @AcmeInterestAccrued)

**Source Material:** Lines 333-380 from enfuce-docs.md

---

### Section 8: Invoice Payment and Settlement
**Status:** Pending approval

**Content:**
- Explanation of invoice payment process
- Settle all outstanding balances (split transaction)
  - Explanation of using multiple destinations
  - cURL example with destinations array
  - Fix syntax issue: missing closing quote in destination
- Update card_primary with repaid principal
  - Explanation of increasing available balance
  - cURL example
- Record overdue interest (if any)
  - Explanation of zeroing out overdue interest
  - cURL example
- Related topics card:
  - Multiple destinations (split transactions)

**Source Material:** Lines 383-460 from enfuce-docs.md

---

### Section 9: Conclusion and Final Updates
**Status:** Pending approval

**Content:**
- Conclusion section:
  - Summary of what was built
  - Key capabilities achieved
  - Optional next steps or enhancements
- RequestTutorial snippet
- Update docs.json:
  - Change "Digital Banking" group name to "Banking and Payments"
  - Add `tutorials/digital-banking/charge-card` to the "Banking and Payments" group

**Source Material:** Conclusion section (to be written), docs.json lines 164-171

---

## Implementation Notes

### Replacements Required:
- "Enfuce" → "Acme" (throughout)
- "@EnfuceFees" → "@AcmeFees"
- "@EnfuceInterestAccrued" → "@AcmeInterestAccrued"

### Code Example Format:
- Use single bash code blocks (no CodeGroup)
- Fix syntax issues (e.g., missing closing quote in Section 8)
- Ensure all placeholders are clear (e.g., `<xavier-ledger-id>`)

### Mintlify Components:
- Use Warning callouts for important notes
- Use Tip callouts for helpful hints
- Use Note callouts for additional information
- Use CardGroup and Card for related topics
- Use horizontal rules (---) between major sections
- Use RequestTutorial snippet at the end

### Tutorial Formatting:
- Convert integration guide bullet points to prose
- Add context and explanations where guide assumes knowledge
- Ensure each step builds logically on previous steps
- Make instructions actionable and followable

---

## Approval Workflow

1. Complete Section 1 → Wait for approval
2. Complete Section 2 → Wait for approval
3. Continue through Section 9 → Wait for approval
4. Final review and updates to docs.json


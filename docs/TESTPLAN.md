# Test Plan — Product Ideas to Test

## Core test set (start here)

1. AI Project Management Tool

- Converts Slack threads and notes into sprint plans and Jira-ready tasks.
- Target market: Startup product and engineering teams running weekly sprint cadences.
- Stage of development: Prototype-level workflow design with manual output review.
- Team constraints: Limited integrations capacity and no dedicated enterprise security support yet.
- What has already been validated: Teams respond positively to auto-structuring messy planning inputs into actionable tasks.


2. Caregiver Coordination App for Aging Parents

- Helps families share medication schedules, appointments, and home-care tasks for elderly relatives across multiple caregivers.
- Target market: Adult children and extended family members coordinating care for aging parents who live independently or with part-time home help.
- Stage of development: Shared calendar and task list MVP with med reminders; no professional caregiver marketplace or clinical integrations yet.
- Team constraints: English-only; no HIPAA-covered provider workflows in v1; relies on family-entered data rather than pharmacy or EHR feeds.
- What has already been validated: Secondary caregivers want visibility when the primary caregiver is unavailable; families engage when updates require less than one minute to post.

3. IT Finance Forecaster

- Helps forecast IT spend based on business strategy and product KPIs.
- Target market: IT finance leaders and CIO office teams at mid-market companies planning annual or quarterly IT budgets.
- Stage of development: Concept with spreadsheet-based forecasting model; no live integrations to ERP or product analytics yet.
- Team constraints: No finance-certified advisory layer; limited historical spend data beyond manual uploads.
- What has already been validated: Finance stakeholders want earlier visibility into how product roadmap changes affect run-rate IT spend.

4. Contract Risk Scanner for SMEs

- Reviews uploaded contracts and flags risky clauses with suggested edits.
- Target market: Founders and ops leads at SMEs (10–100 employees) reviewing vendor, employment, and customer contracts without in-house legal.
- Stage of development: Upload-and-scan MVP for plain-language clause summaries and risk flags; not a substitute for legal counsel.
- Team constraints: English-only; trained on common contract templates, not bespoke M&A or regulated-industry agreements.
- What has already been validated: Users want highlighted "unusual vs market standard" clauses before sending to a lawyer.

5. Vendor Security Questionnaire Copilot

- Helps teams complete security questionnaires and identify missing evidence.
- Target market: Security/compliance leads at B2B SaaS startups responding to 50–200-question vendor assessments.
- Stage of development: MVP focused on questionnaire upload and draft answer generation; evidence mapping is manual.
- Team constraints: Cannot yet support custom SOC 2/ISO control libraries per customer; small team, no 24/7 review workflow.
- What has already been validated: Teams spend 4–8 hours per questionnaire and want faster first drafts with clear "needs evidence" flags.

6. Home Energy Upgrade Planner

- Recommends insulation/HVAC upgrades with ROI estimates and payback windows.
- Target market: Homeowners in regions with rising energy costs considering insulation, HVAC, or solar upgrades.
- Stage of development: Recommendation engine prototype using generic regional tariffs and average home profiles.
- Team constraints: No installer network partnerships yet; ROI models depend on user-supplied utility rates and home age.
- What has already been validated: No installer network partnerships yet; ROI models depend on user-supplied utility rates and home age.

## Additional ideas (broader coverage)

7. Instant Credit for Gig Workers

- Offers short-term advances based on payout and transaction history.
- Target market: Platform gig workers (rideshare, delivery, freelance) with irregular income needing short-term cash between payouts.
- Stage of development: Underwriting rules prototype using payout history; no licensed lending product live in all jurisdictions.
- Team constraints: Regulatory and KYC complexity limit rollout to one pilot market; no banking charter.
- What has already been validated: Workers open the app when payout delays occur; advance limits tied to verified platform earnings reduce default concern in interviews.

8. E-commerce Returns Automation

- Auto-approves returns and schedules pickups from order/photo evidence.
- Target market: D2C and mid-size e-commerce brands processing 500–5,000 returns per month.
- Stage of development: Rules engine for auto-approve/deny plus carrier pickup scheduling; photo evidence review is semi-automated.
- Team constraints: Integrations limited to Shopify and one WMS; fraud detection is rule-based, not ML-heavy.
- What has already been validated: Merchants want to cut manual review on low-value, clear-cut returns while keeping escalation for edge cases.

## Why this mix

- Includes B2B, consumer, healthcare, legal, finance, and offline operations.
- Covers high-regulation domains (health, legal, finance) to pressure-test objections.
- Includes both software-heavy and non-software-heavy workflows.
- Increases chances of surfacing meaningful user exclusion and stakeholder pushback

## Test Run Scoring Rubric (5 checks)

Score each criterion from 1 to 5 after every analysis run.

### 1) Relevance

- Do personas and stakeholder challenges directly relate to the submitted product idea?
- **1** = mostly generic, **5** = highly specific and contextual.

### 2) Blind Spot Novelty

- Does the output reveal non-obvious risks the PM may not have considered?
- **1** = obvious/common points, **5** = genuinely new insights.

### 3) Stakeholder Authenticity

- Do the stakeholder challenges feel like realistic pushback from that lens?
- **1** = vague role-play, **5** = believable and role-accurate concerns.

### 4) Actionability

- Can the PM act on the output immediately (research question, design change, validation step)?
- **1** = abstract advice, **5** = concrete next actions.

### 5) Output Quality

- Is the structure complete and clean (valid JSON shape, no missing required fields)?
- **1** = broken/incomplete output, **5** = fully structured and usable.

## Per-run log template

### Run N

- **Product idea:**  
- **Context provided:**  
- **Relevance (1-5):**  
- **Blind Spot Novelty (1-5):**  
- **Stakeholder Authenticity (1-5):**  
- **Actionability (1-5):**  
- **Output Quality (1-5):**  
- **Total (/25):**  
- **What felt strongest:**  
- **What felt weak/generic:**  
- **Prompt refinement to try next:**

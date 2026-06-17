---
name: blindspot-tester
description: Run the BlindSpot Product Pressure Testing tool for a product idea and save the results. Used to run BlindSpotTesting tool for a user-defined product idea - runs the test idea in the app and save the results to a file. Triggers include 'run BlindSpot test for idea X', 'test Run X', or any request to run a product idea through BlindSpot. 
---

# BlindSpot Tester

You are a **Tester** for the Product Pressure Testing tool **BlindSpot**. 
Your job is to read a user-defined idea in the test plan, retrieve the test values for the idea, run a test in the app and record the results to a file.

## Inputs you need
 
1. **The test plan** —  'TESTPLAN.md'. It contains a numbered list of Product Ideas for testing, each with a title, product idea description and context. This can be found in the project root/docs folder.

2. **Access to the BlindSpot application** - the BlindSpot app must be available on the local development machine or via a public url.

3. **The Claude Chrome Extension** - the Claude Chrome extension must be connected and authorised to run the test.

The fields for a product ideas are listed below. The title is the text on the 1st line after 'Run X'.

```
### Run 1 — AI Project Management Tool

- **Product idea:** Converts Slack threads and notes into sprint plans and Jira-ready tasks.

- **Context provided:**
  - Target market: Startup product and engineering teams running weekly sprint cadences.
  - Stage of development: Prototype-level workflow design with manual output review.
  - Team constraints: Limited integrations capacity and no dedicated enterprise security support yet.
  - What has already been validated: Teams respond positively to auto-structuring messy planning inputs into actionable tasks.

- **Relevance (1-5):** 5
- **Blind Spot Novelty (1-5):** 4
- **Stakeholder Authenticity (1-5):** 4
- **Actionability (1-5):** 3
- **Output Quality (1-5):** 4
- **Total (/25):** 20

```
If the TESTPLAN.MD file is missing, ask the user to provide it before proceeding — do not invent the contents.
 
## Workflow
 
 1) **Read the test plan** Read the file TESTPLAN.MD ("TESTPLAN.MD") from blind-spot-engine project/docs folder. 
 2) **Read the test values** Locate the test field values for the test run that you were asked to complete. Match using the numbering the file.
 3) **Run the test in BlindSpot** Launch the BlindSpotEngine app locally in Chrome and enter the test values into the app
 4) **Enter the product idea** Ensure the product idea includes the full product idea description text and the title (the text after the line Run X.)
 5) **Enter the context for the product idea** Ensure that all test values are entered into the additional context fields
 6) **Run the analysis** Run the blind spot analysis for the product idea
 7) **Wait for the analysis to complete** Wait for the test indicating that the analysis is complete to appear
 8) **Copy the analysis results and save to a file** Extract the analysis into a file "RunX.MD" using the Copy Report button and save to the test-results folder in the project root folder. If an existing file exists for the run, create a new one and call it RunX_Refined.MD. 
 9) **Run the Verification step** (below) 
 
 ## Verification step (mandatory before writing)
 
Confirm RunX.MD was actually created and contains a full report (not a partial/error page) before marking the task done.

Use a task list (TaskCreate/TaskUpdate) to track these steps, including verification.

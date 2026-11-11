# Roadmap

Each stage ends with something that runs and can be demonstrated.
Status: **done** · **in progress** · **planned**

| Stage | What it delivers | Status |
|---|---|---|
| Backend skeleton | FastAPI app, settings from `.env`, `/health` | done |
| Law dataset | CPA 2019 + RTI 2005 parsed into validated section records | done |
| Law search | Plain-English query -> matching act + section; demo page; accuracy eval | done (mentor demo, 17 Nov 2026) |
| Grounded answers | LLM explains the user's rights using **only** retrieved sections, with citations; says so when nothing relevant is found; disclaimer | planned |
| More acts + IPC->BNS mapping | WB Premises Tenancy Act 1997, BNS, BNSS; issue classification; IPC->BNS / CrPC->BNSS tables to correct outdated citations | planned |
| Multilingual + voice | Hindi/Bengali/code-mixed input via Sarvam speech-to-text; answers in the user's language | planned |
| Web frontend | React app with chat and in-browser voice recording (replaces the demo page) | planned |
| Document generation | Template-based RTI application, consumer complaint, legal notice; LLM only fills fields | planned |
| Evaluation | Larger query set (incl. ILSIC), metrics and error analysis for the report | planned |

## Scope (V1)

- Legal areas: consumer, RTI, tenancy (West Bengal only), basic criminal/FIR rights.
- Law cited as **BNS/BNSS/BSA**, never the repealed IPC/CrPC/Evidence Act.

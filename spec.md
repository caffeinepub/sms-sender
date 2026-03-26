# SMS Sender

## Current State
New project. No existing application logic.

## Requested Changes (Diff)

### Add
- Google-only authentication (via authorization component)
- SMS compose form: recipient phone number with country code selector, message body
- Free SMS sending via TextBelt API (HTTP outcall from backend)
- SMS history: list of sent messages with status, recipient, timestamp
- Dashboard layout with compose panel and history panel

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Motoko actor with `sendSms(phone: Text, message: Text)` function that calls TextBelt free API via HTTP outcall. Store sent SMS history per user (principal). Expose `getSmsHistory()` to return history.
2. Frontend: Google login gate. After login, show dashboard with SMS compose form and history list. Country code picker + phone input + message textarea + send button. Display sent SMS log below.

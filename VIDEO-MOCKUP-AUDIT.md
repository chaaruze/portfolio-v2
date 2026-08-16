# Portfolio Video Mockup Audit

## Reminder

Before adding production video to the portfolio, restore or unarchive the relevant projects if their current state is not runnable.

## Recording order

1. **Too Many Chats**
   - Restore the archived project locally if needed.
   - Verify it runs with visibly synthetic SillyTavern chat data.
   - Record: `Before → interaction → verified result`.

2. **STICA Clinic System**
   - Restore the maintenance-only project locally if needed.
   - Use only the isolated synthetic PHP/SQL demonstration.
   - Do not use real medical records, credentials, or private data.

Stop the audit if neither project can be reproduced safely.

## Recommended workflow

- Record the real interface with OBS Studio.
- Use Descript or CapCut for trimming, pacing, captions, and silence cleanup.
- Review every AI-assisted edit manually; AI must not invent actions, outcomes, or metrics.
- Keep the video audio-free unless narration adds clear value.
- Produce an 8–12 second pilot.
- Export WebM and MP4 plus a matching poster image.
- Target approximately 2.5 MB or less.
- Keep the existing static screenshot as the fallback.

## Portfolio requirements

- Use `preload="none"`, lazy loading, inline playback, and explicit user activation.
- Do not autoplay project videos.
- Label synthetic data and project status clearly.
- Do not use generated UI footage or decorative fake product screens.
- Verify keyboard controls, reduced-motion behavior, mobile layout, and JavaScript-disabled fallback.

## Acceptance checklist

- [ ] Project is safely runnable and sanitized.
- [ ] Before/interactions/result sequence is understandable without audio.
- [ ] Video matches the actual project behavior.
- [ ] Static screenshot fallback remains available.
- [ ] WebM, MP4, and poster are exported.
- [ ] File size and loading behavior are acceptable.
- [ ] Privacy and synthetic-data labels are visible.
- [ ] Portfolio video component passes accessibility and reduced-motion checks.

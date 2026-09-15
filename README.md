# Jana After Exams

A mobile-first static website created as a little digital surprise for Jana.

## Files

- `index.html` — the complete interactive experience and all three visual scenes
- `celebration.html` — direct-access fallback that opens the main experience
- `surprise.html` — direct-access fallback that opens the main experience
- `styles.css` — all visual styling and animations
- `script.js` — interactions, flower animation, envelope/letter sequence, and countdown
- `present.png` — supplied present image
- `pink-lily-1.png` — supplied flower image
- `pink-lily-2.png` — supplied flower image
- `white-lily.png` — supplied flower image

## GitHub Pages

1. Create a new GitHub repository.
2. Upload **all files in this folder to the repository root**.
3. Open the repository's **Settings → Pages**.
4. Under the build/deployment source, choose **Deploy from a branch**.
5. Select the branch containing these files and the `/ (root)` folder.
6. Save. GitHub will publish the site.
7. Open the generated GitHub Pages URL.

No npm, React, Vite, backend, database, or build process is required.

## Editing the messages

Open `index.html` and edit the visible text directly. The opening message, celebration text, letter, and final surprise wording are all in the HTML.

## Editing the flight details

The boarding-pass text is in the `#surprise` section of `index.html`. Edit the passenger, date, departure/arrival times, seat, group, and other ticket details there.

## Editing the countdown

Open `script.js` and find:

`new Date(2026, 8, 21, 9, 45, 0, 0)`

JavaScript months are zero-based, so `8` means September. The countdown uses the device's local time.

## Image placement

The four PNG files must remain in the repository root beside `index.html`, exactly as supplied. Do not move them into an `assets` folder unless the code is also changed.

## Notes

The main experience is intentionally implemented as one continuous document. The envelope exists underneath the flower layer from the beginning, so the flower-to-envelope reveal does not require a hard page navigation or blank intermediate screen.

# Quick testing guide

1. Start a local server (see README).
2. Confirm that the sign-in / registration screen is displayed first and the rest of the site is hidden.
3. Select Create account and submit empty fields; confirm that validation appears.
4. Enter a name, valid email, password of at least eight characters, matching confirmation and a language preference.
5. Create the account and confirm that the Home / Browse experience appears.
6. Search `mountain`; confirm Mountain Kingdom appears.
7. Choose genre `Education`; confirm only education titles appear. Reset filters to All.
8. Click Details on a title and open its external trailer link.
9. Add a title to My List. Search and sort the saved titles, then refresh and confirm the list remains.
10. Clear My List and confirm the empty state appears.
11. Open the account menu, check the profile details and sign out. Confirm that the sign-in screen returns.
12. Sign in using the account created earlier. Try an incorrect password first and confirm that an error appears.
13. Submit the contact form with missing / invalid details and confirm browser validation. Submit valid details and confirm the success notification.
14. Test the layout at mobile, tablet and desktop widths.

## Account checks
- The website must not reveal Home, Browse, My List or About before sign-in / registration.
- Switching between Sign in and Create account shows the correct fields.
- Password confirmation must match during registration.
- Duplicate email registration is rejected with a helpful message.
- Correct credentials allow sign-in; incorrect credentials do not.
- The profile menu shows the account name, email and language.
- Signing out returns to the account screen.
- Account storage is browser-specific; this is not a production authentication service.

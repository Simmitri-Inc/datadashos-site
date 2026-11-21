# Waitlist setup (Formspree)

This site is hosted on **GitHub Pages**. The waitlist posts to Formspree — no Netlify or Vercel functions required.

## Steps

1. Create a free account at [https://formspree.io](https://formspree.io).
2. Create a new form (name it e.g. `DataDashOS Waitlist`).
3. Copy the form ID from the endpoint URL: `https://formspree.io/f/XXXXXXXX` → use `XXXXXXXX`.
4. Open [`assets/js/config.js`](assets/js/config.js) and set:
   ```js
   window.DATADASHOS_FORMSPREE_FORM_ID = "XXXXXXXX";
   ```
5. In Formspree → Form Settings:
   - Confirm the notification email where you want waitlist leads.
   - Optionally enable CAPTCHA / spam filters.
   - Allow AJAX / JSON submissions (default for modern Formspree forms).
6. Commit and push so GitHub Pages serves the updated `config.js`.
7. Submit a test signup on the live site. You should land on `thank-you.html`.

## Fields collected

- `name`, `email`, `company`, `industry`, `employees`, `revenue` (optional)
- Demo answers when present: `demo_industry`, `demo_employees`, `demo_goal`

## Contact email

Change once in `assets/js/config.js`:

```js
window.DATADASHOS_CONTACT_EMAIL = "hello@datadashos.com";
```

Every page reads that value for footer/contact links and form error messages.

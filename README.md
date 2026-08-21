# SigPeek

Drop two PDFs. See signatures, incremental saves, and a text diff. Files never leave the browser.

Ask this answers: [Can someone help me understand whether these PDF features indicate that an existing signed PDF was edited?](https://www.reddit.com/r/pdf/comments/1vmiui1/can_someone_help_me_understand_whether_these_pdf/)

- No account
- No upload
- Cap: 12 MB each, 2 files
- Looks for `/Type /Sig`, `ByteRange`, extra `%%EOF`, `/Prev` xref, dates
- Naive text extract for a line diff
- Not a legal forensic service

## Local

Open `index.html` in a browser, or:

```bash
python3 -m http.server 4173
```

A signature byte range that still covers the whole file is a hint, not a verdict. Incremental updates after a signature usually add another `%%EOF`.

## GTM

Reply to people comparing two versions of a signed PDF by hand. Copy is in the page footer.

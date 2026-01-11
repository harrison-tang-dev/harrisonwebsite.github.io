Run the site locally (two easy ways):

1) Node (recommended if you have Node.js installed)

```bash
npm start
# then open http://localhost:8080/ in your browser
```

Or from VS Code: open the Run and Debug pane and choose the compound `Server + Chrome` then press the green ▶️ button. This launches the local server and opens Chrome at http://localhost:8080/

2) Python (no extra files needed)

```bash
python3 -m http.server 8080
# then open http://localhost:8080/ in your browser
```

Notes:
- The server will try `index.html`, `Harrison Tang Portfolio (2).html`, then `<!DOCTYPE html>.html` at root `/`.
- To change which file is served at `/`, edit `server.js` and update the `candidates` array.

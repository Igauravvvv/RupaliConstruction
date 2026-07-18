fetch("http://localhost:58912/api/trpc/localAuth.login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "0": {
      "json": {
        "username": "admin",
        "password": "admin123"
      }
    }
  })
})
.then(async r => {
  console.log("Status:", r.status);
  console.log(await r.text());
})
.catch(console.error);

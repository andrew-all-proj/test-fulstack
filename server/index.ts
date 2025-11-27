import "dotenv/config";
import express from "express";
import path from "path";

import itemsRoutes from "./routes/items.routes";
import selectRoutes from "./routes/select.routes";
import orderRoutes from "./routes/order.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3009;

app.use(express.json());

app.use("/api/items", itemsRoutes);
app.use("/api", selectRoutes);
app.use("/api/order", orderRoutes);

const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      console.error("sendFile error:", err);
      if (!res.headersSent) res.status(500).send("Internal error");
      return next(err);
    }
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error:", err);
  if (!res.headersSent)
    res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

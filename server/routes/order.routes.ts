import { Router } from "express";
import { FuncQueue } from "../queues/func.queue";
import { reorderSelected } from "../services/order.service";

const dataQueue = new FuncQueue(1000);
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    if (!Array.isArray(req.body?.ids))
      return res.status(400).json({ message: "ids must be array" });
    const ids = req.body.ids.map(Number).filter(Number.isInteger);
    res.json(await dataQueue.enqueue(() => reorderSelected(ids)));
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from "express";
import { FuncQueue } from "../queues/func.queue";
import { selectItem, unselectItem } from "../services/select.service";

const dataQueue = new FuncQueue(1000);
const router = Router();

router.post("/select", async (req, res, next) => {
  try {
    const id = Number(req.body?.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ message: "invalid id" });
    res.json(await dataQueue.enqueue(() => selectItem(id)));
  } catch (err) {
    next(err);
  }
});

router.post("/unselect", async (req, res, next) => {
  try {
    const id = Number(req.body?.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ message: "invalid id" });
    res.json(await dataQueue.enqueue(() => unselectItem(id)));
  } catch (err) {
    next(err);
  }
});

export default router;

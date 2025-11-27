import { Router } from "express";
import { FuncQueue } from "../queues/func.queue";
import { AddItemQueue } from "../queues/addItem.queue";
import { getItems } from "../services/items.service";
import { SideEnum } from "../../shared/types";

const dataQueue = new FuncQueue(1000);
const addQueue = new AddItemQueue(10000);

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const side =
      req.query.side === SideEnum.RIGHT ? SideEnum.RIGHT : SideEnum.LEFT;
    const offset = Number(req.query.offset) || 0;
    const limit = Math.min(Number(req.query.limit) || 20, 20);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await dataQueue.enqueue(() =>
      getItems({ side, offset, limit, search })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const id = Number(req.body?.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ message: "invalid id" });

    const result = await addQueue.enqueue(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

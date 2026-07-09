import { Router } from "express";
import { categoryController } from "./categories.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN,Role.TECHNICIAN), categoryController.createCategory)
router.get("/", categoryController.getAllCategories);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCatagory)


export const categoriesRoute = router;
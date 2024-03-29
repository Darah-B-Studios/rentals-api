import { Request, Response } from "express";
import {
  IUserDoc,
  IUserDocResponse,
  emptyUserDoc,
} from "../../domain/models/user-doc";
import { UserDocUseCase } from "../../domain/usecases/user-doc.usecase";
import { UserDocRepository } from "../../data/repositories/impl/user-doc.repository";
import { UserDocMapper } from "../mappers/mapper";
import { NotFoundException } from "../../shared/exceptions/not-found.exception";
import { User } from "../../data/entities/user";
import { UserDoc } from "../../data/entities/user-doc";
import { nanoid } from "nanoid";

const userDocRepository = new UserDocRepository();
const userDocUseCase = new UserDocUseCase(userDocRepository);
const userDocMapper = new UserDocMapper();

export class UserDocsController {
  async createUserDoc(
    req: Request,
    res: Response<IUserDocResponse>
  ): Promise<void> {
    const user = req.user as User;

    //get uploaded files
    const { idCard1, idCard2, passportPhoto } = req.files as any;
    if (!req.files) {
      throw new Error("Please select files!");
    }

    try {
      const userDocResponse = await userDocUseCase.createUserDoc({
        userId: user.id,
        idCard1: idCard1[0].filename,
        idCard2: idCard2[0].filename,
        passportPhoto: passportPhoto[0].filename,
        id: nanoid(10),
      });

      res.status(201).json({
        data: userDocResponse.toJSON<IUserDoc>(),
        message: "UserDoc submitted Successfully!",
        validationErrors: [],
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [],
        success: false,
      });
    }
  }

  async getAll(req: Request, res: Response<any>): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const { rows, count } = await userDocUseCase.getAll(page, pageSize);
      const userDocsDTO = userDocMapper.toDTOs(rows);

      // total pages
      const totalPages = Math.ceil(count / pageSize);

      res.json({
        data: userDocsDTO,
        message: "Success",
        validationErrors: [],
        success: true,
        currentPage: page,
        totalPages,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      });
    }
  }

  async getUserDocById(
    req: Request,
    res: Response<IUserDocResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      const userDoc = await UserDoc.findByPk(id);
      if (!userDoc) {
        throw new NotFoundException("UserDoc", id);
      }
      const userDocDTO = userDocMapper.toDTO(userDoc);

      // search user by ID
      const user = await User.findByPk(userDocDTO.userId);

      if (!user) {
        throw new NotFoundException("User", `${userDoc.userId}`);
      }
      // Update the user's verification status

      await user.update({
        ...user,
        verified: true,
      });
      await user.save();

      res.json({
        data: userDocDTO,
        message: "Success",
        validationErrors: [],
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      });
    }
  }

  async updateUserDoc(
    req: Request,
    res: Response<IUserDocResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userDoc = await UserDoc.findByPk(id);
      if (!userDoc) {
        throw new NotFoundException("userDoc", `${id}`);
      }

      // search user by ID
      const user = await User.findByPk(userDoc.userId);
      if (!user) {
        throw new NotFoundException("User", `${userDoc.userId}`);
      }

      const obj: IUserDoc = {
        ...emptyUserDoc,
        ...req.body,
        id: id,
      };
      const updatedUserDoc = await userDocUseCase.updateUserDoc(obj);
      // Update the user's verification status
      user.verified = true;
      await user.save();

      const userDocDto = userDocMapper.toDTO(updatedUserDoc);

      res.json({
        data: userDocDto,
        message: "UserDoc Updated Successfully!",
        validationErrors: [],
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      });
    }
  }

  async deleteUserDoc(
    req: Request,
    res: Response<IUserDocResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      await userDocUseCase.deleteUserDoc(id);

      res.status(204).json({
        message: `Operation successfully completed!`,
        validationErrors: [],
        success: true,
        data: null,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      });
    }
  }
}

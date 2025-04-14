import { Request, Response, NextFunction } from "express";
import * as userController from "../src/api/v1/controllers/userController";
import * as userService from "../src/api/v1/services/userService";
import { User } from "src/api/v1/models/userModel";

jest.mock("../src/api/v1/services/userService", () => ({
  getAllUsers: jest.fn(),
  getUserByUID: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deactivateUser: jest.fn(),
}));

describe("user Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  const userObj: User = {
    id: "1234",
    uid: "1234",
    email: "abc@rrc.ca",
    displayName: "abc",
    photoURL: "testurl.com",
    role: "user",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  let users: User[];
  beforeEach(() => {
    users = [userObj];
    jest.clearAllMocks();
    mockReq = { query: {}, params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { uid: "admin" },
    };
    mockNext = jest.fn();
  });

  describe("getAllUsers", () => {
    it("should return the users ", async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue(users);
      await userController.getAllUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Retrieved",
        data: users,
        status: "success",
      });
    });

    it("should call the next funtion for handle error when error occurs while get all users", async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValue("failed");

      await userController.getAllUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("get User by UID", () => {
    it("should return the user with the specific id", async () => {
      (userService.getUserByUID as jest.Mock).mockResolvedValue(userObj);

      mockReq.params = { id: "1234" };

      await userController.getUserByUID(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Found",
        data: userObj,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while get specific user", async () => {
      (userService.getUserByUID as jest.Mock).mockRejectedValue("failed");
      mockReq.params = { id: "1234" };
      await userController.getUserByUID(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("createUser", () => {
    it("should create the user successfully", async () => {
      mockReq.body = { email: "abc@rrc.ca", password: "XFDFD" };
      (userService.createUser as jest.Mock).mockResolvedValue(userObj);

      mockReq.params = { id: "1234" };

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Created",
        data: userObj,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while create specific user", async () => {
      (userService.createUser as jest.Mock).mockRejectedValue("failed");
      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("updateUser", () => {
    it("should update the user successfully", async () => {
      mockReq.body = { displayName: "new name" };
      (userService.updateUser as jest.Mock).mockResolvedValue(userObj);

      mockReq.params = { id: "1234" };

      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Updated",
        data: userObj,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while update specific user", async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue("failed");
      mockReq.params = { id: "1234" };
      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("Delete user", () => {
    it("should delete the user successfully", async () => {
      (userService.deactivateUser as jest.Mock).mockResolvedValue(userObj);

      mockReq.params = { id: "1234" };

      await userController.deactivateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Deleted",
        data: userObj,
        status: "success",
      });
    });
  });
  it("should call the next funtion for handle error when error occurs while delete specific user", async () => {
    (userService.deactivateUser as jest.Mock).mockRejectedValue("failed");
    mockReq.params = { id: "1234" };
    await userController.deactivateUser(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

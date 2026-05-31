import * as usersService from "../services/users.service.js";

export async function getUsers(req, res, next) {
  try {
    const users = await usersService.getUsers();

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsersByRole(req, res, next) {
  try {
    const users = await usersService.getUsersByRole(req.params.role);

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {

    console.log("Creating user with data:", req.body); // Debugging log
    const user = await usersService.createUser(req.body);

    console.log("User created:", user); // Debugging log

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await usersService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      data: user,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}


import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
}


import { authClient } from '../http/authClient';
import { activationRoute, loginRoute, registerRoute } from '../utils/APIRoutes';

type PropsRegister = {
  userName: string,
  email: string,
  password: string,
};

type PropsLogin = {
  email: string,
  password: string,
};

function register({ userName, email, password }: PropsRegister) {
  return authClient.post(registerRoute, { userName, email, password });
}

function login({ email, password }: PropsLogin) {
  return authClient.post(loginRoute, { email, password });
}

function activate(activationToken: string) {
  return authClient.get(`${activationRoute}/${activationToken}`);
}

export const authService = {
  register, login, activate,
};

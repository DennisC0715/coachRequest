let timer;

export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "login",
    });
  },

  ///////////////////////////////////////////////////////
  async signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },
  /////////////////////////////////////
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      userId: null,
    });
  },
  ///////////////////////
  async auth(context, payload) {
    const email = payload.email;
    const password = payload.password;
    const mode = payload.mode;
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCwFLV6jkkMsp4yskU-mtE0FVRMdagWFPk";
    if (mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwFLV6jkkMsp4yskU-mtE0FVRMdagWFPk";
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.error.message || "Please enter correct email or password"
      );
      throw error;
    }
    //
    const expiresIn = responseData.expiresIn * 1000;
    // const expiresIn = 5000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem("token", responseData.idToken);
    localStorage.setItem("userId", responseData.localId);
    localStorage.setItem("tokenExpiration", expirationDate);

    timer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);

    context.commit("setUser", {
      userId: responseData.localId,
      token: responseData.idToken,
    });
  },
  ///////////////////////////////

  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpirationDate = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpirationDate - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);

    if (token && userId) {
      context.commit("setUser", {
        token: token,
        userId: userId,
      });
    }
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};

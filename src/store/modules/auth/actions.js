export default {
  async login(context, payload) {
    const email = payload.email;
    const password = payload.password;
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCwFLV6jkkMsp4yskU-mtE0FVRMdagWFPk",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.error.message || "Please enter correct email or password"
      );
      throw error;
    }

    console.log(responseData);
    context.commit("setUser", {
      userId: responseData.localId,
      token: responseData.idToken,
      tokenExpiration: responseData.expiresIn,
    });
  },

  ///////////////////////////////////////////////////////
  async signup(context, payload) {
    const email = payload.email;
    const password = payload.password;
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwFLV6jkkMsp4yskU-mtE0FVRMdagWFPk",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(
        responseData.error.message || "Fail to signup try again later"
      );
      throw error;
    }

    console.log(responseData);
    context.commit("setUser", {
      userId: responseData.localId,
      token: responseData.idToken,
      tokenExpiration: responseData.expiresIn,
    });
  },

  /////////////////////////////////////
  logout(context) {
    context.commit("setUser", {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },
};

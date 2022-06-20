export default {
  async contactCoach(context, payload) {
    const newRequest = {
      email: payload.email,
      message: payload.message,
    };

    const response = await fetch(
      `https://vuecoach-bd4c5-default-rtdb.firebaseio.com/coachRequest/${payload.coachId}.json`,
      {
        method: "POST",
        body: JSON.stringify(newRequest),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(resData.message || "Failed to send request");
      throw error;
    }

    newRequest.id = responseData.name;
    newRequest.coachId = payload.coachId;

    context.commit("addRequest", { newRequest });
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const token = context.rootGetters.token;

    const response = await fetch(
      `https://vuecoach-bd4c5-default-rtdb.firebaseio.com/coachRequest/${coachId}.json?auth=` +
        token
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(resData.message || "Failed to send request");
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        email: responseData[key].email,
        message: responseData[key].message,
      };
      requests.push(request);
    }

    context.commit("setRequest", requests);
  },
};

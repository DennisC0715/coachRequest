export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.firstName,
      lastName: data.lastName,
      description: data.description,
      hourlyRate: data.hourlyRate,
      areas: data.areas,
    };
    const token = context.rootGetters.token;
    console.log(token);
    const res = await fetch(
      `https://vuecoach-bd4c5-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
        token,
      {
        method: "PUT",
        body: JSON.stringify(coachData),
      }
    );

    const responseData = await res.json();
    if (!res.ok) {
    }

    context.commit("registerCoach", { ...coachData, id: userId });
  },

  async loadCoach(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const res = await fetch(
      `https://vuecoach-bd4c5-default-rtdb.firebaseio.com/coaches.json`
    );

    const resData = await res.json();

    if (!res.ok) {
      const error = new Error(resData.message || "Failed to fetch");
      throw error;
    }

    const coaches = [];
    for (const key in resData) {
      const coach = {
        id: key,
        firstName: resData[key].firstName,
        lastName: resData[key].lastName,
        areas: resData[key].areas,
        description: resData[key].description,
        hourlyRate: resData[key].hourlyRate,
      };
      coaches.push(coach);
    }

    context.commit("setCoaches", coaches);
    context.commit("setFetchTimestamp");
  },
};

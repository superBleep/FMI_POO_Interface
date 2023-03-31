export async function getUserData() {
    const dataRoute = `http://localhost:4000/getUserData`;
    await fetch(dataRoute, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    .then((response) => response.json()) 
    .then((data) => {
      // daca contul de github nu este in baza de date, loginul a esuat
      const allowedUsers = ['test1','test2', 'alex-toma0']
      if (!allowedUsers.includes(data.login)) {
        localStorage.removeItem("accessToken");
        window.alert("Contul nu este in baza de date! Loginul a esuat!");
      }
      else {
        callback(data);
      }
    });
  }
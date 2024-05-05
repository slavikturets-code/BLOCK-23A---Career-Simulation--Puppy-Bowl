const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

class Player{
  constructor(name, breed, status, imageUrl){ 
  this.name =  name;
  this.breed =  breed;
  this.status = status;
  this.imageUrl = imageUrl;
 };
}

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();

  });

  test("returns an array", async () => {
    
    expect(Array.isArray(await fetchAllPlayers())).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`

describe("fetchSinglePlayer", () => {
  // Make the API call once before all the tests run
  let player;
  beforeAll(async () => {
    player = await fetchSinglePlayer(5562);

  });

  test("returns not null", async () => {
    
    expect(player).not.toBe(null);
  });

  test("returns player with name and id", async () => {
    
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
  
  });
});

// TODO: Tests for `addNewPlayer`

describe("addNewPlayer", () => {
  let player;
  
  test("returns not null", async () => {
    player = await addNewPlayer(new Player("George","Siberian Husky","bench","https://www.siberianhuskyrescue.org/wp-content/uploads/husky.jpg"));
    await expect(player).not.toBe(null);
  });

});

// (Optional) TODO: Tests for `removePlayer`

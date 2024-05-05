// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2402-ftb-mt-web-pt";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

//const main = document.querySelector("main");
const playerForm = document.getElementById("new-player-form");
const submitBtn = document.getElementById("submit");
const cardStorage = document.getElementById("cardStorage");
const popupContainer = document.querySelector(".popup");
const popupContent = document.querySelector(".popup-content");
const closePopupBtn = document.getElementById("close-popup");

class Player{
  constructor(name, breed, status, imageUrl, teamId){ 
  this.name =  name;
  this.breed =  breed;
  this.status = status;
  this.imageUrl = imageUrl;
  this.teamId = teamId;
 };
}

function createSeeDetailsButton(player) {
  const detailsBtn = document.createElement("button");
  detailsBtn.innerText = "See details";
  detailsBtn.classList.add("player-btn");
  detailsBtn.addEventListener("click", async () => {
    try {
      renderSinglePlayer(player);
      //console.log(player);
    } catch (err) {
      console.log(err);
    }
  });
  return detailsBtn;
}

function createRemoveFromRosterButton(player) {
  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove player";
  removeBtn.classList.add("player-btn");
  removeBtn.classList.add("remove-player-btn");
  let cardStorage = document.getElementById("cardStorage")
  removeBtn.addEventListener("click", async () => {
    
  try {
       await removePlayer(player.id);
       while (cardStorage.hasChildNodes())
         cardStorage.firstChild.remove()
       console.log("cardStorage:",cardStorage) ;
       await renderAllPlayers(await fetchAllPlayers());
      //console.log(player);
    } catch (err) {
      console.log(err);
    }
  });
  return removeBtn;
}

function createPopupPlayerDetailsUI(player){
   
  const playerName = document.getElementById("playerName");
  playerName.innerText = `Name: ${player.name}`;

  const playerId = document.getElementById("playerId");
  playerId.innerText = `ID: ${player.id}`;

  const breed = document.getElementById("breed");
  breed.innerText = `Breed: ${player.breed}`;

  const status = document.getElementById("status");
  status.innerText = `Status: ${player.status}`;

  const createdAt = document.getElementById("createdAt");
  createdAt.innerText = `CreatedAt: ${player.createdAt}`;

  const detailedImage = document.getElementById("detailedImage");
  detailedImage.src = player.imageUrl;
  detailedImage.alt = player.name;

  cardStorage.style.visibility = "hidden";
  playerForm.style.visibility = "hidden";

  popupContainer.classList.add("popup-visible");
  popupContent.classList.add("popup-content-full-size");
}

function createPlayerInfo(player){

  //console.log("player:",player);
  const playerCard = document.createElement("div");
  playerCard.id = `div${player.id}`;
  playerCard.classList.add("player-card");

  const playerName = document.createElement("p");
  playerName.innerText = `Name: ${player.name}`;

  const playerId = document.createElement("p");
  playerId.innerText = `ID: ${player.id}`;

  const playerImage = document.createElement("img");
  playerImage.src = player.imageUrl;
  playerImage.alt = player.name;

  playerCard.appendChild(playerName);
  playerCard.appendChild(playerId);
  playerCard.appendChild(playerImage);
  playerCard.appendChild(createSeeDetailsButton(player));
  playerCard.appendChild(createRemoveFromRosterButton(player));
  return playerCard;
}

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
        const response = await fetch(`${API_URL}/players`);
        const dataObj = await response.json();
        return dataObj.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      method: 'GET'
    });
    const playerData = await response.json();
    return playerData.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
      
    const response = await fetch(`${API_URL}/players/`,{
      headers: {
        'Content-Type': 'application/json',
      },
      mode:'cors',
      method: 'POST',
      body: JSON.stringify({
         name: playerObj.name,
         breed: playerObj.breed,
         status: playerObj.status,
         imageUrl: playerObj.imageUrl,
         teamId: playerObj.teamId  
      })
    });
    const playerData = await response.json();
    return playerData;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`,
      {
        method: 'DELETE'
      }
    );
    const result = await response.json();
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,err);
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {

  //const main = document.querySelector("main");
  //console.log(Array.isArray(playerList));
  playerList.forEach((player) => {
    console.log("pl: ",player);
    cardStorage.appendChild(createPlayerInfo(player));
    
});
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  createPopupPlayerDetailsUI(player);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = async () => {
  try {
     let playerName = document.getElementById("inputPlayerName");
     let breed = document.getElementById("inputBreed");
     let status = document.getElementById("inputStatus");
     let imageUrl = document.getElementById("inputImageUrl");
     console.log("name:",playerName);
     let partyObj = new Player(playerName.value, breed.value, status.value, imageUrl.value, 1);
     await addNewPlayer(partyObj);
     while (cardStorage.hasChildNodes())
      cardStorage.firstChild.remove()     
     await renderAllPlayers(await fetchAllPlayers());
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  await renderAllPlayers(players);

  //renderNewPlayerForm();
};

closePopupBtn.addEventListener("click", () => {
  popupContainer.classList.remove("popup-visible");
  popupContent.classList.remove("popup-content-full-size");
  cardStorage.style.visibility = "visible";
  playerForm.style.visibility = "visible";
});

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}

playerForm.addEventListener("submit",renderNewPlayerForm()); 




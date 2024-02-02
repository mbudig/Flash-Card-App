console.log("executing flash_cards.js");

const div_card_controller = document.getElementById("card-controller");
const div_add_card = document.getElementById("add-card");
const id_new_card_form = document.getElementById("new-card-form");
const div_validation = document.getElementById("validation");
id_new_card_form.addEventListener('submit', handleCreateNewCardEvent);

let currentIndex = 0;
let flipped = false;
let isVisible = false;


async function displayCard(index)
{
    const list_of_cards = await getListOfCards();
    let currentCard = list_of_cards[index];
    console.log(index);

    div_card_controller.innerHTML = `<p id="card-text">${currentCard.front}</p>`;
}

async function nextCard()
{
    const list_of_cards = await getListOfCards();
    let currentCard = list_of_cards[nextCircularIndex(list_of_cards, currentIndex)];
    flipped = false;

    div_card_controller.innerHTML = `<p id="card-text">${currentCard.front}</p>`;
}

async function previousCard()
{
    const list_of_cards = await getListOfCards();
    let currentCard = list_of_cards[previousCircularIndex(list_of_cards, currentIndex)];
    flipped = false;

    div_card_controller.innerHTML = `<p id="card-text">${currentCard.front}</p>`;
}

async function flipCard()
{
    const list_of_cards = await getListOfCards();
    let currentCard = list_of_cards[currentIndex];

    if (flipped)
    {
        flipped = false;
        div_card_controller.innerHTML = `<p id="card-text">${currentCard.front}</p>`;
    }
    else
    {
        flipped = true;
        div_card_controller.innerHTML = `<p id="card-text">${currentCard.back}</p>`;
    }
}

function showForm()
{
    if (isVisible)
    {
        div_add_card.style.visibility = "hidden";
        isVisible = false;
    }
    else
    {
        div_add_card.style.visibility = "visible";
        isVisible = true;
    }
}

async function handleCreateNewCardEvent(event)
{
    event.preventDefault();

    const formData = new FormData(id_new_card_form);
    const cardData =
        {
            front: formData.get("front"),
            back: formData.get("back")
        };
    console.log({cardData});
    await createNewCard(cardData);
}

async function getListOfCards()
{
    const API_URL = "http://localhost:8080/flash_cards";

    console.log(`Calling API ${API_URL} to get flash cards`);

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfCards = await response.json();
            console.log({listOfCards});
            return listOfCards;
        }
    }
    catch (err)
    {
        console.error(err);
        console.log(`Could not reach API ${API_URL}`);
    }
}

async function createNewCard(cardData)
{
    const API_URL = "http://localhost:8080/flash_cards";

    try
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(cardData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_validation.innerHTML = `<p>Successfully added new card</p>`;
        }
        else
        {
            div_validation.innerHTML = `<p>Failed to add new card</p>`;
        }
    }
    catch (err)
    {
        console.error(err);
    }
}

async function deleteCard()
{
    const confirmed = confirm("Are you sure you want to delete this card?");

    if (confirmed)
    {
        const list_of_cards = await getListOfCards();
        const currentCard = list_of_cards[currentIndex];
        const id = currentCard.id;

        const API_URL = `http://localhost:8080/flash_cards/${id}`;

        try
        {
            const response = await fetch(API_URL, {method: "DELETE"});
            console.log({response});
            console.log(`response.status = ${response.status}`);
            console.log(`response.statusText = ${response.statusText}`);
            console.log(`response.ok = ${response.ok}`);

            if (response.ok)
            {
                alert("Successfully deleted card");
                await nextCard();
            }
        }
        catch (err)
        {
            console.error(err);
        }
    }
}

function nextCircularIndex(list, index)
{
    const listLength = list.length;
    currentIndex = (index + 1) % listLength;
    return currentIndex;
}

function previousCircularIndex(list, index)
{
    const listLength = list.length;
    currentIndex =  (index + listLength - 1) % listLength;
    return currentIndex;
}
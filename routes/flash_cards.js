let express = require('express');
let router = express.Router();
const db = require("./../db");

router.get("/flash_cards", async function (req, res)
{
    console.log("Getting flash cards");
    try
    {
        const listOfFlashCards = await db.getAllFlashCards();
        console.log("listOfFlashCards:", listOfFlashCards);

        res.send(listOfFlashCards);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(500).json({"error": "Internal server error"});
    }
});

router.post("/flash_cards", async function (req, res)
{
    console.log("Posting to database");
    try
    {
        const front = req.body.front;
        const back = req.body.back;

        console.log(front);
        console.log(back);

        if (front === null)
        {
            res.status(400).json({"error": "bad request: expected parameter 'front' is not defined"});
            return;
        }

        if (back === null)
        {
            res.status(400).json({"error": "bad request: expected parameter 'back' is not defined"});
            return;
        }

        if (front.length > 50)
        {
            res.status(400).json({"error": "bad request: parameter 'front' exceeds 50 characters"});
            return;
        }

        if (back.length > 100)
        {
            res.status(400).json({"error": "bad request: parameter 'back' exceeds 100 characters"});
        }

        let createdCard =
        {
            id: null,
            front: front,
            back: back
        };

        createdCard = await db.addNewCard(createdCard);

        res.status(201).json(createdCard);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(500).json({"error": "Internal server error"});
    }
})

router.delete("/flash_cards/:id", async function (req, res)
{
    try
    {
        const id = req.params.id;
        console.log("id = " + id);

        const cardToDelete = await db.getCardWithId(id);
        console.log({cardToDelete});

        if (cardToDelete == null)
        {
            console.log("No card with id " + id + " exists");

            res.status(404).json({"error": "failed to delete card with id = " + id + " from the database because it does not exist"});
            return;
        }

        await db.deleteExistingCard(id);

        res.status(204).send();
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(422).json({"error": "Internal server error"});
    }
})

module.exports = router;
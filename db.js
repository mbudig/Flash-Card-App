const util = require("util");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const SQLITE_FILE_NAME = "cards.sqlite";

let db;

db = new sqlite3.Database('./' + SQLITE_FILE_NAME, function(err)
{
    if (err)
    {
        return console.error(err.message);
    }

    db.get("PRAGMA foreign_keys = ON;");

    console.log(`Connected to '${SQLITE_FILE_NAME}' SQLite database for development.`);
});

function getAllFlashCards()
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            console.log("Hello1");
            const sql =
                `SELECT id, front, back
                 FROM flash_cards;`;

            let listOfFlashCards = [];

            const callbackEachRowProcessing = function(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                const id = row.id;
                const front = row.front;
                const back = row.back;

                console.log(`id: ${id}, front: ${front}`);

                const flashCardForCurrentRow =
                    {
                        id: id,
                        front: front,
                        back: back
                    };

                listOfFlashCards.push(flashCardForCurrentRow);
            };

            const callbackAfterAllRowsProcessed = function()
            {
                resolve(listOfFlashCards);
            };

            db.each(sql, callbackEachRowProcessing, callbackAfterAllRowsProcessed);
        });
    });
}

function getCardWithId(id)
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `SELECT id, front, back
                 FROM flash_cards
                 WHERE id = ?;`;

            function callbackAfterReturnedRowIsProcessed(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                if (row === undefined)
                {
                    resolve(null);
                    return;
                }

                const id = row.id;
                const front = row.front;
                const back = row.back;

                const cardForCurrentRow =
                    {
                        id: id,
                        front: front,
                        back: back
                    };

                resolve(cardForCurrentRow);
            }
            db.get(sql, [id], callbackAfterReturnedRowIsProcessed);
        });
    });
}

function addNewCard(newCard)
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `INSERT INTO flash_cards (front, back)
                 VALUES (?, ?);`;

            function callbackAfterReturnedRowIsProcessed(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                const numberOfRowsAffected = this.changes;
                if (numberOfRowsAffected > 0)
                {
                    const generatedIdForTheNewlyInsertedCard = this.lastID;

                    console.log("SUCCESSFULLY inserted new card with id = " + generatedIdForTheNewlyInsertedCard);

                    newCard.id = generatedIdForTheNewlyInsertedCard;

                    resolve(newCard);
                }
            }
            db.run(sql, [newCard.front, newCard.back], callbackAfterReturnedRowIsProcessed);
        });
    });
}

function deleteExistingCard(id)
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `DELETE FROM flash_cards
             WHERE id = ?;`;

            function callbackAfterReturnedRowIsProcessed(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                const numberOfRowsAffected = this.changes;
                if (numberOfRowsAffected > 0)
                {
                    console.log("SUCCESSFULLY deleted card with id = " + id);

                    resolve(id);
                }
                else
                {
                    reject("ERROR: could not delete card wit id = " + id);
                }
            }
            db.run(sql, [id], callbackAfterReturnedRowIsProcessed);
        });
    });
}

module.exports = {
    getAllFlashCards,
    getCardWithId,
    addNewCard,
    deleteExistingCard
};
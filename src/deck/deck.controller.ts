import type {Request, Response} from 'express';
import prisma from '../client'

export const getDeck = async (_req: Request, res: Response) => {
    try{
        const decks = await prisma.deck.findMany({
            include: {
                owner: {
                select: {
                    id: true,
                    email: true
                }
                },
                cards: true
            }
        });
        res.status(200).send(decks);
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}

export const getDeckById = async (req: Request, res: Response) => {
    const deckId = req.params.deckId;

    try{
        const deck = await prisma.deck.findUnique({
            where: {id: Number(deckId)},
            include: {
                owner: {
                select: {
                    id: true,
                    email: true
                }
                },
                cards: true
            }
        });

        if(!deck){
            res.status(404).send({error: "Deck non trouvé"});
            return
        }
        res.status(200).send(deck);
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}

export const createDeck = async(req: Request, res: Response) => {
    const {name, cards} = req.body;
    const ownerId = req.userId;

    try {
    // verification user authentifie
    if (!ownerId) {
      res.status(401).send({ error: "Utilisateur non authentifié" });
      return;
    }

    // verification du nom
    if (!name || name.trim() === "") {
      res.status(400).send({ error: "Le nom du deck est obligatoire" });
      return;
    }

    // verification des cartes
    if (!cards) {
      res.status(400).send({ error: "Les cartes sont obligatoires" });
      return;
    }

    if (!Array.isArray(cards)) {
      res.status(400).send({ error: "Les cartes doivent être un tableau" });
      return;
    }

    // verification que toutes les cartes existent
    const existingCards = await prisma.pokemonCard.findMany({
      where: {
        id: {in: cards}
      }
    });

    if (existingCards.length !== cards.length) {
      res.status(400).send({ error: "Une ou plusieurs cartes n'existent pas" });
      return;
    }

    // tout est ok on continue

    // creation du deck
    const deck = await prisma.deck.create({
        data : {
            name,
            owner: {
                connect: {id: Number(ownerId)}
            },
            cards: {
                connect: cards.map((cardId: number) => ({id: cardId}))
            }
        },

        // pour recup tous les champs et pas que les champs de deck
        include: {
            owner: {
                select: {
                    id: true,
                    email: true
                }
            },
            cards: true
        }
    });

    res.status(201).send(deck);
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}


